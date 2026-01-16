/**
 * QR Code Data String Generator for Portuguese Invoices
 * Required by Portaria n.º 195/2020
 *
 * The QR Code must be printed on all invoices and contains:
 * - Company NIF
 * - Customer NIF
 * - Country of customer
 * - Document type
 * - Document status
 * - Document date
 * - Document number
 * - ATCUD
 * - Tax breakdown by rate
 * - Gross total
 * - Document hash (4-character control)
 */

export interface QRCodeData {
    // Company information
    companyNIF: string;           // 9-digit NIF

    // Customer information
    customerNIF: string;          // 9-digit NIF (use "999999990" for final consumer)
    customerCountry: string;      // ISO 3166-1 alpha-2 (e.g., "PT")

    // Document information
    documentType: string;         // e.g., "FT", "FR", "NC"
    documentStatus: string;       // "N" = Normal, "A" = Cancelled, "F" = Finalized
    documentDate: string;         // Format: YYYYMMDD
    documentNumber: string;       // Format: Series/Number (e.g., "FT 2026/1")

    // ATCUD
    atcud: string;                // Format: ValidationCode-DocumentNumber

    // Financial data
    taxBreakdown: TaxBreakdown[]; // Tax details by rate
    grossTotal: number;           // Total with taxes

    // Digital signature
    hashControl: string;          // 4-character hash control
}

export interface TaxBreakdown {
    taxCountryRegion: string;     // "PT", "PT-MA", "PT-AC"
    taxCode: string;              // "NOR", "INT", "RED", "ISE"
    taxPercentage: number;        // Tax rate (e.g., 23.00)
    taxBase: number;              // Net amount
    taxAmount: number;            // Tax value
}

export class QRCodeGenerator {
    /**
     * Generates QR Code data string according to Portaria n.º 195/2020
     *
     * Format (fields separated by asterisks):
     * A:CompanyNIF*B:CustomerNIF*C:Country*D:DocType*E:Status*F:Date*G:DocNumber*H:ATCUD*I1:PT-NOR-23.00*I2:100.00*I3:23.00*[...]*N:123.00*O:HashControl*
     *
     * Field descriptions:
     * A - Company NIF (Emitter)
     * B - Customer NIF (Acquirer)
     * C - Customer Country
     * D - Document Type
     * E - Document Status
     * F - Document Date (YYYYMMDD)
     * G - Document Number
     * H - ATCUD
     * I - Tax breakdown (I1: Rate identifier, I2: Taxable base, I3: Tax amount)
     * N - Gross Total
     * O - 4-character hash control
     *
     * @param data - QR code data components
     * @returns QR code data string
     */
    public static generate(data: QRCodeData): string {
        const fields: string[] = [];

        // A: Company NIF
        fields.push(`A:${data.companyNIF}`);

        // B: Customer NIF (use "999999990" for final consumer without NIF)
        fields.push(`B:${data.customerNIF || '999999990'}`);

        // C: Customer Country (ISO 3166-1 alpha-2)
        fields.push(`C:${data.customerCountry}`);

        // D: Document Type
        fields.push(`D:${data.documentType}`);

        // E: Document Status
        fields.push(`E:${data.documentStatus}`);

        // F: Document Date (YYYYMMDD)
        const formattedDate = this.formatDateForQR(data.documentDate);
        fields.push(`F:${formattedDate}`);

        // G: Document Number
        fields.push(`G:${data.documentNumber}`);

        // H: ATCUD
        fields.push(`H:${data.atcud}`);

        // I: Tax breakdown (can have multiple I1, I2, I3 sets)
        if (data.taxBreakdown && data.taxBreakdown.length > 0) {
            for (const tax of data.taxBreakdown) {
                // I1: Tax identifier (CountryRegion-TaxCode-Percentage)
                const taxIdentifier = `${tax.taxCountryRegion}-${tax.taxCode}-${tax.taxPercentage.toFixed(2)}`;
                fields.push(`I1:${taxIdentifier}`);

                // I2: Taxable base (net amount)
                fields.push(`I2:${tax.taxBase.toFixed(2)}`);

                // I3: Tax amount
                fields.push(`I3:${tax.taxAmount.toFixed(2)}`);
            }
        }

        // N: Gross Total
        fields.push(`N:${data.grossTotal.toFixed(2)}`);

        // O: 4-character hash control
        fields.push(`O:${data.hashControl}`);

        // Join all fields with asterisks
        return fields.join('*');
    }

    /**
     * Formats date to YYYYMMDD format for QR code
     *
     * @param date - Date string or Date object
     * @returns Formatted date string (YYYYMMDD)
     */
    private static formatDateForQR(date: string | Date): string {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');

        return `${year}${month}${day}`;
    }

    /**
     * Validates QR code data before generation
     *
     * @param data - QR code data to validate
     * @throws Error if validation fails
     */
    public static validate(data: QRCodeData): void {
        // Validate company NIF
        if (!data.companyNIF || !/^\d{9}$/.test(data.companyNIF)) {
            throw new Error('Invalid company NIF. Must be 9 digits.');
        }

        // Validate customer NIF (can be "999999990" for final consumer)
        if (!data.customerNIF || !/^\d{9}$/.test(data.customerNIF)) {
            throw new Error('Invalid customer NIF. Must be 9 digits or "999999990" for final consumer.');
        }

        // Validate country code
        if (!data.customerCountry || data.customerCountry.length !== 2) {
            throw new Error('Invalid country code. Must be ISO 3166-1 alpha-2 (e.g., "PT").');
        }

        // Validate document type
        if (!data.documentType || data.documentType.trim().length === 0) {
            throw new Error('Document type is required.');
        }

        // Validate document status
        if (!['N', 'A', 'F'].includes(data.documentStatus)) {
            throw new Error('Invalid document status. Must be N, A, or F.');
        }

        // Validate ATCUD
        if (!data.atcud || !data.atcud.includes('-')) {
            throw new Error('Invalid ATCUD format.');
        }

        // Validate hash control
        if (!data.hashControl || data.hashControl.length !== 4) {
            throw new Error('Invalid hash control. Must be 4 characters.');
        }

        // Validate gross total
        if (data.grossTotal < 0) {
            throw new Error('Gross total cannot be negative.');
        }
    }

    /**
     * Generates QR code data string with validation
     *
     * @param data - QR code data components
     * @returns QR code data string
     * @throws Error if validation fails
     */
    public static generateSafe(data: QRCodeData): string {
        this.validate(data);
        return this.generate(data);
    }
}

/**
 * Standalone function to generate QR code data string
 */
export function generateQRCodeData(data: QRCodeData): string {
    return QRCodeGenerator.generate(data);
}
