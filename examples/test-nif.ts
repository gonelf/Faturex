/**
 * Example: Testing Portuguese NIF Validation
 * Demonstrates the Modulo 11 algorithm implementation
 */

import { NIFValidator } from '../src/utils/nif-validator';

console.log('='.repeat(60));
console.log('Portuguese NIF Validation - Modulo 11 Algorithm Test');
console.log('='.repeat(60));
console.log();

// Test cases
const testNIFs = [
    { nif: '123456789', expected: false, description: 'Invalid NIF' },
    { nif: '111111111', expected: false, description: 'Invalid NIF (all ones)' },
    { nif: '999999990', expected: true, description: 'Valid NIF (final consumer)' },
    { nif: '500000000', expected: false, description: 'Invalid first digit' },
    { nif: '12345678', expected: false, description: 'Too short' },
    { nif: '1234567890', expected: false, description: 'Too long' },
];

console.log('Testing predefined NIFs:');
console.log('-'.repeat(60));

testNIFs.forEach(test => {
    const isValid = NIFValidator.validate(test.nif);
    const result = isValid === test.expected ? '✓ PASS' : '✗ FAIL';
    const status = isValid ? 'VALID' : 'INVALID';

    console.log(`${result} | ${test.nif} | ${status} | ${test.description}`);
});

console.log();
console.log('='.repeat(60));
console.log('Generating random valid NIFs for testing:');
console.log('-'.repeat(60));

for (let i = 0; i < 5; i++) {
    const randomNIF = NIFValidator.generateRandomForTesting();
    const isValid = NIFValidator.validate(randomNIF);
    const formatted = NIFValidator.format(randomNIF);

    console.log(`${i + 1}. ${randomNIF} (Formatted: ${formatted}) - ${isValid ? 'VALID ✓' : 'INVALID ✗'}`);
}

console.log();
console.log('='.repeat(60));
console.log('Validation with error handling:');
console.log('-'.repeat(60));

try {
    NIFValidator.validateOrThrow('123456789');
    console.log('✗ Should have thrown an error for invalid NIF');
} catch (error: any) {
    console.log(`✓ Correctly rejected invalid NIF: ${error.message}`);
}

try {
    const validNIF = NIFValidator.generateRandomForTesting();
    NIFValidator.validateOrThrow(validNIF);
    console.log(`✓ Accepted valid NIF: ${validNIF}`);
} catch (error: any) {
    console.log(`✗ Incorrectly rejected valid NIF: ${error.message}`);
}

console.log();
console.log('='.repeat(60));
console.log('Test completed!');
console.log('='.repeat(60));

/**
 * Run this test:
 * npx ts-node examples/test-nif.ts
 */
