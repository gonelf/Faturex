/**
 * Billing Service - Core Business Logic
 * Orchestrates invoice creation, finalization, and SAF-T compliance
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SignatureService, SignatureData } from './signature.service';
import { ATCUDGenerator } from '../utils/atcud.util';
import { QRCodeGenerator, QRCodeData, TaxBreakdown } from '../utils/qrcode.util';
import { NIFValidator } from '../utils/nif-validator';

export interface InvoiceLineInput {
    productId: string;
    quantity: number;
    unitPrice: number;
    description?: string;
    taxId: string;
}

export interface CreateInvoiceInput {
    seriesId: string;
    customerId: string;
    invoiceDate: string;
    sourceId: string;
    lines: InvoiceLineInput[];
}

export interface Invoice {
    id: string;
    seriesId: string;
    invoiceNo: string;
    documentNumber: number;
    atcud: string;
    documentHash: string;
    hashControl: string;
    documentStatus: string;
    invoiceDate: string;
    systemEntryDate: string;
    customerId: string;
    taxPayable: number;
    netTotal: number;
    grossTotal: number;
    qrCodeData: string;
    previousHash?: string;
}

export class BillingService {
    private supabase: SupabaseClient;
    private signatureService: SignatureService;
    private companyNIF: string;

    constructor(
        supabaseUrl: string,
        supabaseKey: string,
        privateKey: string,
        companyNIF: string
    ) {
        this.supabase = createClient(supabaseUrl, supabaseKey);
        this.signatureService = new SignatureService(privateKey);
        this.companyNIF = companyNIF;

        // Validate company NIF
        NIFValidator.validateOrThrow(this.companyNIF);
    }

    /**
     * Creates a new draft invoice
     * Document is created in 'N' (Normal/Draft) status
     *
     * @param input - Invoice creation data
     * @returns Created invoice
     */
    public async createInvoice(input: CreateInvoiceInput): Promise<Invoice> {
        // Start a transaction
        const { data: series, error: seriesError } = await this.supabase
            .from('billing_series')
            .select('*')
            .eq('id', input.seriesId)
            .eq('is_active', true)
            .single();

        if (seriesError || !series) {
            throw new Error('Invalid or inactive billing series');
        }

        // Get next document number (atomic operation via database function)
        const { data: nextNumberData, error: nextNumberError } = await this.supabase
            .rpc('get_next_document_number', { p_series_id: input.seriesId });

        if (nextNumberError) {
            throw new Error('Failed to get next document number: ' + nextNumberError.message);
        }

        const documentNumber = nextNumberData as number;

        // Build invoice number: Series/Number (e.g., "FT 2026/1")
        const invoiceNo = `${series.series_code} ${series.series_year || new Date().getFullYear()}/${documentNumber}`;

        // Generate ATCUD
        const atcud = ATCUDGenerator.generate(series.validation_code, documentNumber);

        // Get customer data
        const { data: customer, error: customerError } = await this.supabase
            .from('customers')
            .select('*')
            .eq('id', input.customerId)
            .single();

        if (customerError || !customer) {
            throw new Error('Invalid customer');
        }

        // Validate customer NIF
        NIFValidator.validateOrThrow(customer.customer_tax_id);

        // Calculate line totals
        const lines = await this.calculateLineTotals(input.lines);

        // Calculate invoice totals
        const totals = this.calculateInvoiceTotals(lines);

        // Get previous document hash for chaining
        const previousHash = await this.getPreviousDocumentHash(input.seriesId);

        // Get system entry date
        const systemEntryDate = new Date().toISOString();

        // Build signature data
        const signatureData: SignatureData = {
            invoiceDate: input.invoiceDate,
            systemEntryDate: systemEntryDate,
            invoiceNo: invoiceNo,
            grossTotal: totals.grossTotal.toFixed(2),
            previousHash: previousHash || ''
        };

        // Generate digital signature
        const documentHash = this.signatureService.signDocument(signatureData);

        // Extract 4-character hash control
        const hashControl = this.signatureService.extractHashControl(documentHash);

        // Generate QR code data
        const qrCodeData = this.generateQRCodeData({
            invoiceNo,
            atcud,
            invoiceDate: input.invoiceDate,
            documentType: series.invoice_type,
            documentStatus: 'N',
            customerNIF: customer.customer_tax_id,
            customerCountry: customer.billing_address_country || 'PT',
            hashControl,
            totals,
            lines
        });

        // Insert invoice
        const { data: invoice, error: invoiceError } = await this.supabase
            .from('invoices')
            .insert({
                series_id: input.seriesId,
                invoice_no: invoiceNo,
                document_number: documentNumber,
                atcud: atcud,
                document_hash: documentHash,
                hash_control: hashControl,
                document_status: 'N',
                invoice_date: input.invoiceDate,
                source_id: input.sourceId,
                system_entry_date: systemEntryDate,
                customer_id: input.customerId,
                tax_payable: totals.taxPayable,
                net_total: totals.netTotal,
                gross_total: totals.grossTotal,
                qr_code_data: qrCodeData,
                previous_hash: previousHash
            })
            .select()
            .single();

        if (invoiceError) {
            throw new Error('Failed to create invoice: ' + invoiceError.message);
        }

        // Insert invoice lines
        await this.insertInvoiceLines(invoice.id, lines);

        // Insert status history
        await this.insertStatusHistory(invoice.id, 'N', input.sourceId, 'Invoice created');

        return invoice as Invoice;
    }

    /**
     * Finalizes an invoice, making it immutable
     * Changes status from 'N' to 'F'
     *
     * SAF-T Requirement: Once finalized, documents cannot be edited or deleted
     *
     * @param invoiceId - Invoice ID to finalize
     * @param sourceId - User finalizing the document
     * @returns Finalized invoice
     */
    public async finalizeInvoice(invoiceId: string, sourceId: string): Promise<Invoice> {
        // Get current invoice
        const { data: invoice, error: fetchError } = await this.supabase
            .from('invoices')
            .select('*')
            .eq('id', invoiceId)
            .single();

        if (fetchError || !invoice) {
            throw new Error('Invoice not found');
        }

        // Check if already finalized
        if (invoice.document_status === 'F') {
            throw new Error('Invoice is already finalized');
        }

        // Check if cancelled
        if (invoice.document_status === 'A') {
            throw new Error('Cannot finalize a cancelled invoice');
        }

        // Update status to finalized
        const { data: finalizedInvoice, error: updateError } = await this.supabase
            .from('invoices')
            .update({
                document_status: 'F',
                finalized_at: new Date().toISOString()
            })
            .eq('id', invoiceId)
            .select()
            .single();

        if (updateError) {
            throw new Error('Failed to finalize invoice: ' + updateError.message);
        }

        // Insert status history
        await this.insertStatusHistory(invoiceId, 'F', sourceId, 'Invoice finalized');

        return finalizedInvoice as Invoice;
    }

    /**
     * Cancels an invoice (changes status to 'A')
     * Note: Finalized invoices cannot be cancelled
     *
     * @param invoiceId - Invoice ID to cancel
     * @param sourceId - User cancelling the document
     * @param reason - Reason for cancellation
     * @returns Cancelled invoice
     */
    public async cancelInvoice(invoiceId: string, sourceId: string, reason: string): Promise<Invoice> {
        // Get current invoice
        const { data: invoice, error: fetchError } = await this.supabase
            .from('invoices')
            .select('*')
            .eq('id', invoiceId)
            .single();

        if (fetchError || !invoice) {
            throw new Error('Invoice not found');
        }

        // Check if finalized (cannot cancel finalized invoices)
        if (invoice.document_status === 'F') {
            throw new Error('Cannot cancel a finalized invoice');
        }

        // Update status to cancelled
        const { data: cancelledInvoice, error: updateError } = await this.supabase
            .from('invoices')
            .update({
                document_status: 'A'
            })
            .eq('id', invoiceId)
            .select()
            .single();

        if (updateError) {
            throw new Error('Failed to cancel invoice: ' + updateError.message);
        }

        // Insert status history
        await this.insertStatusHistory(invoiceId, 'A', sourceId, reason);

        return cancelledInvoice as Invoice;
    }

    /**
     * Gets the hash of the previous document in the series for chaining
     * Returns empty string if this is the first document
     *
     * @param seriesId - Billing series ID
     * @returns Previous document hash or empty string
     */
    private async getPreviousDocumentHash(seriesId: string): Promise<string> {
        const { data, error } = await this.supabase
            .from('invoices')
            .select('document_hash')
            .eq('series_id', seriesId)
            .order('document_number', { ascending: false })
            .limit(1);

        if (error || !data || data.length === 0) {
            return ''; // First document in the series
        }

        return data[0].document_hash;
    }

    /**
     * Calculates line totals including taxes
     */
    private async calculateLineTotals(lines: InvoiceLineInput[]): Promise<any[]> {
        const calculatedLines = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // Get tax data
            const { data: tax, error: taxError } = await this.supabase
                .from('taxes')
                .select('*')
                .eq('id', line.taxId)
                .single();

            if (taxError || !tax) {
                throw new Error(`Invalid tax ID for line ${i + 1}`);
            }

            // Calculate amounts
            const taxBase = line.quantity * line.unitPrice;
            const taxAmount = (taxBase * tax.tax_percentage) / 100;
            const lineGrossTotal = taxBase + taxAmount;

            calculatedLines.push({
                ...line,
                lineNumber: i + 1,
                taxBase,
                taxAmount,
                lineGrossTotal,
                tax
            });
        }

        return calculatedLines;
    }

    /**
     * Calculates invoice totals from lines
     */
    private calculateInvoiceTotals(lines: any[]): { netTotal: number; taxPayable: number; grossTotal: number } {
        const netTotal = lines.reduce((sum, line) => sum + line.taxBase, 0);
        const taxPayable = lines.reduce((sum, line) => sum + line.taxAmount, 0);
        const grossTotal = netTotal + taxPayable;

        return { netTotal, taxPayable, grossTotal };
    }

    /**
     * Inserts invoice lines into database
     */
    private async insertInvoiceLines(invoiceId: string, lines: any[]): Promise<void> {
        const linesToInsert = lines.map(line => ({
            invoice_id: invoiceId,
            line_number: line.lineNumber,
            product_id: line.productId,
            quantity: line.quantity,
            unit_of_measure: 'UN',
            unit_price: line.unitPrice,
            tax_base: line.taxBase,
            tax_point_date: new Date().toISOString().split('T')[0],
            description: line.description,
            tax_id: line.taxId,
            settlement_amount: 0,
            line_net_total: line.taxBase,
            line_tax_amount: line.taxAmount,
            line_gross_total: line.lineGrossTotal
        }));

        const { error } = await this.supabase
            .from('invoice_lines')
            .insert(linesToInsert);

        if (error) {
            throw new Error('Failed to insert invoice lines: ' + error.message);
        }
    }

    /**
     * Inserts document status history
     */
    private async insertStatusHistory(
        invoiceId: string,
        statusCode: string,
        sourceId: string,
        reason: string
    ): Promise<void> {
        const { error } = await this.supabase
            .from('document_status_history')
            .insert({
                invoice_id: invoiceId,
                status_code: statusCode,
                status_description: reason,
                source_id: sourceId
            });

        if (error) {
            throw new Error('Failed to insert status history: ' + error.message);
        }
    }

    /**
     * Generates QR code data string for invoice
     */
    private generateQRCodeData(params: any): string {
        // Group taxes by rate for QR code
        const taxBreakdown: TaxBreakdown[] = [];
        const taxMap = new Map<string, { base: number; amount: number; tax: any }>();

        for (const line of params.lines) {
            const key = `${line.tax.tax_country_region}-${line.tax.tax_code}-${line.tax.tax_percentage}`;

            if (taxMap.has(key)) {
                const existing = taxMap.get(key)!;
                existing.base += line.taxBase;
                existing.amount += line.taxAmount;
            } else {
                taxMap.set(key, {
                    base: line.taxBase,
                    amount: line.taxAmount,
                    tax: line.tax
                });
            }
        }

        // Convert to tax breakdown array
        taxMap.forEach((value) => {
            taxBreakdown.push({
                taxCountryRegion: value.tax.tax_country_region,
                taxCode: value.tax.tax_code,
                taxPercentage: value.tax.tax_percentage,
                taxBase: value.base,
                taxAmount: value.amount
            });
        });

        const qrData: QRCodeData = {
            companyNIF: this.companyNIF,
            customerNIF: params.customerNIF,
            customerCountry: params.customerCountry,
            documentType: params.documentType,
            documentStatus: params.documentStatus,
            documentDate: params.invoiceDate,
            documentNumber: params.invoiceNo,
            atcud: params.atcud,
            taxBreakdown,
            grossTotal: params.totals.grossTotal,
            hashControl: params.hashControl
        };

        return QRCodeGenerator.generate(qrData);
    }
}
