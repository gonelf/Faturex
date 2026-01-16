/**
 * Digital Signature Service for Portuguese Billing Documents
 * Implements RSA-SHA1 signing as required by Portaria n.º 363/2010
 *
 * SAF-T Reference: Field 4.1.4.19 - Hash calculation
 *
 * Chaining Logic:
 * Each document signature includes:
 * - Invoice Date (4.1.4.5)
 * - System Entry Date (4.1.4.9)
 * - Invoice Number (4.1.4.1)
 * - Gross Total (4.1.4.14.3)
 * - Previous Document Hash (creates an immutable chain)
 */

import * as crypto from 'crypto';

export interface SignatureData {
    invoiceDate: string;          // Format: YYYY-MM-DD
    systemEntryDate: string;      // Format: YYYY-MM-DDThh:mm:ss
    invoiceNo: string;            // Format: Series/Number (e.g., "FT 2026/1")
    grossTotal: string;           // Decimal value as string (e.g., "123.45")
    previousHash: string;         // Previous document's hash (empty for first document)
}

export class SignatureService {
    private privateKey: string;

    constructor(privateKey?: string) {
        // Load private key from environment or parameter
        this.privateKey = privateKey || process.env.RSA_PRIVATE_KEY || '';

        if (!this.privateKey) {
            throw new Error(
                'RSA_PRIVATE_KEY not found. Please set the environment variable with your private key.'
            );
        }

        // Validate key format
        this.validatePrivateKey();
    }

    /**
     * Validates that the private key is in correct PEM format
     */
    private validatePrivateKey(): void {
        try {
            // Try to create a key object to validate format
            crypto.createPrivateKey(this.privateKey);
        } catch (error) {
            throw new Error(
                'Invalid RSA private key format. Expected PEM format starting with -----BEGIN RSA PRIVATE KEY-----'
            );
        }
    }

    /**
     * Generates the string to be signed according to SAF-T requirements
     *
     * Format (separated by semicolons):
     * InvoiceDate;SystemEntryDate;InvoiceNo;GrossTotal;PreviousHash
     *
     * Example:
     * "2026-01-16;2026-01-16T14:30:00;FT 2026/1;123.45;previousHashHere"
     *
     * @param data - Signature data components
     * @returns String to be signed
     */
    private buildSignatureString(data: SignatureData): string {
        // Format dates to SAF-T format
        const invoiceDate = this.formatDate(data.invoiceDate);
        const systemEntryDate = this.formatDateTime(data.systemEntryDate);

        // Format gross total to 2 decimal places
        const grossTotal = parseFloat(data.grossTotal).toFixed(2);

        // Build the string according to SAF-T specification
        const signatureString = [
            invoiceDate,
            systemEntryDate,
            data.invoiceNo,
            grossTotal,
            data.previousHash || '' // Empty for first document
        ].join(';');

        return signatureString;
    }

    /**
     * Signs document data using RSA-SHA1
     *
     * Process:
     * 1. Build signature string from document data
     * 2. Sign using RSA with SHA1 hash
     * 3. Encode result to Base64
     *
     * @param data - Document data to sign
     * @returns Base64-encoded RSA signature
     */
    public signDocument(data: SignatureData): string {
        // Build the string to be signed
        const signatureString = this.buildSignatureString(data);

        // Create signature using RSA-SHA1
        const sign = crypto.createSign('RSA-SHA1');
        sign.update(signatureString);
        sign.end();

        // Sign and encode to Base64
        const signature = sign.sign(this.privateKey, 'base64');

        return signature;
    }

    /**
     * Extracts the 4-character control hash for printed documents
     *
     * According to Portaria n.º 363/2010:
     * - Take characters at positions: 1, 11, 21, and 31 of the hash
     * - This creates a human-readable verification code
     *
     * @param hash - Full Base64 signature hash
     * @returns 4-character control hash
     */
    public extractHashControl(hash: string): string {
        if (!hash || hash.length < 31) {
            throw new Error('Hash is too short to extract control characters');
        }

        // Extract characters at positions 1, 11, 21, 31 (0-indexed: 0, 10, 20, 30)
        const controlHash = [
            hash.charAt(0),
            hash.charAt(10),
            hash.charAt(20),
            hash.charAt(30)
        ].join('');

        return controlHash;
    }

    /**
     * Verifies a document signature
     *
     * @param data - Original document data
     * @param signature - Signature to verify
     * @param publicKey - RSA public key for verification
     * @returns true if signature is valid
     */
    public verifySignature(data: SignatureData, signature: string, publicKey: string): boolean {
        try {
            const signatureString = this.buildSignatureString(data);

            const verify = crypto.createVerify('RSA-SHA1');
            verify.update(signatureString);
            verify.end();

            return verify.verify(publicKey, signature, 'base64');
        } catch (error) {
            console.error('Signature verification failed:', error);
            return false;
        }
    }

    /**
     * Formats date to SAF-T format (YYYY-MM-DD)
     */
    private formatDate(date: string | Date): string {
        const d = new Date(date);
        return d.toISOString().split('T')[0];
    }

    /**
     * Formats datetime to SAF-T format (YYYY-MM-DDThh:mm:ss)
     */
    private formatDateTime(date: string | Date): string {
        const d = new Date(date);
        return d.toISOString().split('.')[0]; // Remove milliseconds
    }

    /**
     * Generates a test RSA key pair for development
     * WARNING: Use only for testing/development
     *
     * @returns Object with privateKey and publicKey in PEM format
     */
    public static generateTestKeyPair(): { privateKey: string; publicKey: string } {
        const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 1024, // As per Portuguese requirements
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs1',
                format: 'pem'
            }
        });

        return { privateKey, publicKey };
    }
}

/**
 * Utility function to create signature service instance
 */
export function createSignatureService(privateKey?: string): SignatureService {
    return new SignatureService(privateKey);
}
