/**
 * ATCUD (Código Único do Documento) Generator
 * Required by Portaria n.º 195/2020
 *
 * ATCUD Format: ValidationCode-DocumentNumber
 * Example: "CSVP8Y9-1", "ABCD123-42"
 *
 * The Validation Code is provided by the Portuguese Tax Authority (AT)
 * when registering a billing series.
 */

export interface ATCUDComponents {
    validationCode: string;  // Provided by AT (e.g., "CSVP8Y9")
    documentNumber: number;  // Sequential number within the series (e.g., 1, 2, 3...)
}

export class ATCUDGenerator {
    /**
     * Generates ATCUD string from components
     *
     * SAF-T Field: 4.1.4.16 - ATCUD
     *
     * Format: ValidationCode-DocumentNumber
     * - ValidationCode: Alphanumeric code from AT
     * - DocumentNumber: Sequential number (no leading zeros)
     *
     * @param validationCode - Code provided by AT for the series
     * @param documentNumber - Sequential document number
     * @returns ATCUD string (e.g., "CSVP8Y9-1")
     */
    public static generate(validationCode: string, documentNumber: number): string {
        // Validate validation code
        if (!validationCode || validationCode.trim().length === 0) {
            throw new Error('Validation Code is required for ATCUD generation');
        }

        // Validate document number
        if (documentNumber < 1) {
            throw new Error('Document number must be greater than 0');
        }

        // Format: ValidationCode-DocumentNumber
        return `${validationCode.trim()}-${documentNumber}`;
    }

    /**
     * Parses an ATCUD string into its components
     *
     * @param atcud - ATCUD string (e.g., "CSVP8Y9-1")
     * @returns Object with validationCode and documentNumber
     */
    public static parse(atcud: string): ATCUDComponents {
        if (!atcud || !atcud.includes('-')) {
            throw new Error('Invalid ATCUD format. Expected: ValidationCode-DocumentNumber');
        }

        const parts = atcud.split('-');
        if (parts.length !== 2) {
            throw new Error('Invalid ATCUD format. Expected: ValidationCode-DocumentNumber');
        }

        const validationCode = parts[0];
        const documentNumber = parseInt(parts[1], 10);

        if (isNaN(documentNumber)) {
            throw new Error('Invalid document number in ATCUD');
        }

        return {
            validationCode,
            documentNumber
        };
    }

    /**
     * Validates ATCUD format
     *
     * @param atcud - ATCUD string to validate
     * @returns true if valid format
     */
    public static validate(atcud: string): boolean {
        try {
            const components = this.parse(atcud);
            return components.validationCode.length > 0 && components.documentNumber > 0;
        } catch {
            return false;
        }
    }
}

/**
 * Standalone function to generate ATCUD
 */
export function generateATCUD(validationCode: string, documentNumber: number): string {
    return ATCUDGenerator.generate(validationCode, documentNumber);
}

/**
 * Standalone function to parse ATCUD
 */
export function parseATCUD(atcud: string): ATCUDComponents {
    return ATCUDGenerator.parse(atcud);
}
