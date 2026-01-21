/**
 * Encryption Service
 *
 * Provides AES-256-GCM encryption/decryption for sensitive data
 * Used primarily for encrypting AT credentials
 *
 * Security features:
 * - AES-256-GCM (Galois/Counter Mode) for authenticated encryption
 * - Random IV (Initialization Vector) for each encryption
 * - Authentication tag to verify data integrity
 * - Key derivation from environment variable
 */

import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16; // 128 bits
const AUTH_TAG_LENGTH = 16; // 128 bits
const SALT_LENGTH = 32; // 256 bits

/**
 * Get encryption key from environment
 * Falls back to deriving from RSA private key if ENCRYPTION_KEY not set
 */
function getEncryptionKey(): Buffer {
  // Try dedicated encryption key first
  const encryptionKey = process.env.ENCRYPTION_KEY;
  if (encryptionKey) {
    // Key should be 32 bytes (256 bits) hex string
    return Buffer.from(encryptionKey, 'hex');
  }

  // Fallback: derive from RSA private key (temporary for development)
  const rsaKey = process.env.RSA_PRIVATE_KEY;
  if (!rsaKey) {
    throw new Error('Neither ENCRYPTION_KEY nor RSA_PRIVATE_KEY is set in environment');
  }

  // Derive 256-bit key from RSA key using SHA-256
  const hash = crypto.createHash('sha256');
  hash.update(rsaKey);
  return hash.digest();
}

/**
 * Derive encryption key from password using PBKDF2
 * Used for additional key derivation when needed
 */
function deriveKey(password: string, salt: Buffer): Buffer {
  return crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');
}

/**
 * Encrypt data using AES-256-GCM
 *
 * @param plaintext - The data to encrypt
 * @returns Encrypted data in format: {iv}:{encryptedData}:{authTag} (all base64)
 */
export function encrypt(plaintext: string): string {
  if (!plaintext) {
    throw new Error('Cannot encrypt empty data');
  }

  try {
    // Generate random IV
    const iv = crypto.randomBytes(IV_LENGTH);

    // Get encryption key
    const key = getEncryptionKey();

    // Create cipher
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    // Encrypt data
    let encrypted = cipher.update(plaintext, 'utf8', 'base64');
    encrypted += cipher.final('base64');

    // Get authentication tag
    const authTag = cipher.getAuthTag();

    // Return format: iv:encryptedData:authTag (all base64)
    return `${iv.toString('base64')}:${encrypted}:${authTag.toString('base64')}`;
  } catch (error) {
    throw new Error(`Encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Decrypt data using AES-256-GCM
 *
 * @param encryptedData - The encrypted data in format: {iv}:{encryptedData}:{authTag}
 * @returns Decrypted plaintext
 */
export function decrypt(encryptedData: string): string {
  if (!encryptedData) {
    throw new Error('Cannot decrypt empty data');
  }

  try {
    // Parse encrypted data format: iv:encryptedData:authTag
    const parts = encryptedData.split(':');
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted data format. Expected format: {iv}:{encryptedData}:{authTag}');
    }

    const [ivBase64, encrypted, authTagBase64] = parts;

    // Convert from base64
    const iv = Buffer.from(ivBase64, 'base64');
    const authTag = Buffer.from(authTagBase64, 'base64');

    // Validate IV and auth tag lengths
    if (iv.length !== IV_LENGTH) {
      throw new Error(`Invalid IV length: ${iv.length}, expected ${IV_LENGTH}`);
    }
    if (authTag.length !== AUTH_TAG_LENGTH) {
      throw new Error(`Invalid auth tag length: ${authTag.length}, expected ${AUTH_TAG_LENGTH}`);
    }

    // Get encryption key
    const key = getEncryptionKey();

    // Create decipher
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    // Decrypt data
    let decrypted = decipher.update(encrypted, 'base64', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    throw new Error(`Decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Generate a random encryption key (256 bits)
 * Use this to generate ENCRYPTION_KEY for environment variables
 *
 * @returns Hex-encoded 256-bit key
 */
export function generateKey(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Hash data using SHA-256 (one-way)
 * Used for non-reversible hashing (e.g., storing password hashes for comparison)
 *
 * @param data - Data to hash
 * @returns Hex-encoded SHA-256 hash
 */
export function hash(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Verify if plaintext matches a hash
 *
 * @param plaintext - Original data
 * @param hashedData - Previously hashed data
 * @returns True if plaintext matches hash
 */
export function verifyHash(plaintext: string, hashedData: string): boolean {
  const computedHash = hash(plaintext);
  return crypto.timingSafeEqual(Buffer.from(computedHash), Buffer.from(hashedData));
}

// Export default object with all functions
export default {
  encrypt,
  decrypt,
  generateKey,
  hash,
  verifyHash,
};
