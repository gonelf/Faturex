/**
 * Portuguese NIF (Número de Identificação Fiscal) Validator
 * Uses Modulo 11 algorithm as required by Portuguese Tax Authority
 *
 * Valid NIF formats:
 * - 9 digits
 * - Must start with: 1, 2, 3, 5, 6, 8, 9 (individuals and companies)
 * - Check digit calculated using Modulo 11
 */

export class NIFValidator {
    /**
     * Valid first digits for Portuguese NIF
     */
    private static readonly VALID_FIRST_DIGITS = [1, 2, 3, 5, 6, 8, 9];

    /**
     * Validates a Portuguese NIF using the Modulo 11 algorithm
     *
     * Algorithm:
     * 1. Multiply each of the first 8 digits by the sequence: 9, 8, 7, 6, 5, 4, 3, 2
     * 2. Sum all the results
     * 3. Calculate: 11 - (sum % 11)
     * 4. If result is >= 10, check digit is 0
     * 5. Otherwise, check digit is the result
     *
     * @param nif - Portuguese NIF (9 digits as string)
     * @returns true if valid, false otherwise
     */
    public static validate(nif: string): boolean {
        // Remove spaces and trim
        const cleanNIF = nif.replace(/\s/g, '').trim();

        // Must be exactly 9 digits
        if (!/^\d{9}$/.test(cleanNIF)) {
            return false;
        }

        // Check if first digit is valid
        const firstDigit = parseInt(cleanNIF.charAt(0), 10);
        if (!this.VALID_FIRST_DIGITS.includes(firstDigit)) {
            return false;
        }

        // Apply Modulo 11 algorithm
        const digits = cleanNIF.split('').map(d => parseInt(d, 10));

        // Multiply first 8 digits by sequence: 9, 8, 7, 6, 5, 4, 3, 2
        let sum = 0;
        for (let i = 0; i < 8; i++) {
            sum += digits[i] * (9 - i);
        }

        // Calculate check digit
        const modulo = sum % 11;
        const checkDigit = modulo === 0 || modulo === 1 ? 0 : 11 - modulo;

        // Validate against the 9th digit
        return checkDigit === digits[8];
    }

    /**
     * Formats a NIF with spaces for display (XXX XXX XXX)
     *
     * @param nif - Portuguese NIF (9 digits)
     * @returns Formatted NIF string
     */
    public static format(nif: string): string {
        const cleanNIF = nif.replace(/\s/g, '').trim();

        if (cleanNIF.length !== 9) {
            return nif;
        }

        return `${cleanNIF.substring(0, 3)} ${cleanNIF.substring(3, 6)} ${cleanNIF.substring(6, 9)}`;
    }

    /**
     * Validates and throws an error if invalid
     * Useful for database constraints and API validation
     *
     * @param nif - Portuguese NIF (9 digits)
     * @throws Error if NIF is invalid
     */
    public static validateOrThrow(nif: string): void {
        if (!this.validate(nif)) {
            throw new Error(`Invalid Portuguese NIF: ${nif}. Must be 9 digits and pass Modulo 11 validation.`);
        }
    }

    /**
     * Generates a valid random NIF for testing purposes
     * WARNING: Use only for testing/development
     *
     * @returns Valid 9-digit NIF string
     */
    public static generateRandomForTesting(): string {
        // Random first digit from valid options
        const firstDigit = this.VALID_FIRST_DIGITS[
            Math.floor(Math.random() * this.VALID_FIRST_DIGITS.length)
        ];

        // Generate random 7 middle digits
        let nif = firstDigit.toString();
        for (let i = 0; i < 7; i++) {
            nif += Math.floor(Math.random() * 10).toString();
        }

        // Calculate check digit
        const digits = nif.split('').map(d => parseInt(d, 10));
        let sum = 0;
        for (let i = 0; i < 8; i++) {
            sum += digits[i] * (9 - i);
        }

        const modulo = sum % 11;
        const checkDigit = modulo === 0 || modulo === 1 ? 0 : 11 - modulo;

        return nif + checkDigit.toString();
    }
}

/**
 * Standalone validation function for convenience
 */
export function validateNIF(nif: string): boolean {
    return NIFValidator.validate(nif);
}

/**
 * Standalone format function for convenience
 */
export function formatNIF(nif: string): string {
    return NIFValidator.format(nif);
}
