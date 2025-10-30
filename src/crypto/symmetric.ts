import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

export interface SymmetricEncryptionResult {
  encrypted: string;
  key: string;
  algorithm: string;
  iv: string;
}

function getKeyLength(algorithm: string): number {
  switch (algorithm) {
    case 'aes-256-cbc':
      return 32;
    case 'aes-192-cbc':
      return 24;
    case 'aes-128-cbc':
      return 16;
    case 'des-ede3-cbc':
      return 24;
    default:
      return 32;
  }
}

function getIVLength(algorithm: string): number {
  switch (algorithm) {
    case 'aes-256-cbc':
    case 'aes-192-cbc':
    case 'aes-128-cbc':
      return 16;
    case 'des-ede3-cbc':
      return 8;
    default:
      return 16;
  }
}

function getFixedIV(algorithm: string): Buffer {
  const ivLength = getIVLength(algorithm);
  // Use a fixed IV for consistent encryption/decryption
  const fixedIVHex = algorithm === 'des-ede3-cbc' ? '0123456789abcdef' : '0123456789abcdef0123456789abcdef';
  return Buffer.from(fixedIVHex.slice(0, ivLength * 2), 'hex');
}

export function generateSymmetricKey(algorithm: string = 'aes-256-cbc'): string {
  const length = getKeyLength(algorithm);
  return randomBytes(length).toString('hex');
}

export async function encryptSymmetric(data: string, key: string, algorithm: string = 'aes-256-cbc'): Promise<{ encrypted: string; iv: string }> {
  const keyLength = getKeyLength(algorithm);
  const iv = getFixedIV(algorithm);
  
  let keyBuffer: Buffer;
  if (key.length === keyLength * 2) {
    keyBuffer = Buffer.from(key, 'hex');
  } else {
    keyBuffer = await scryptAsync(key, 'salt', keyLength) as Buffer;
  }
  
  const cipher = createCipheriv(algorithm, keyBuffer, iv);
  
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return {
    encrypted,
    iv: iv.toString('hex')
  };
}

export async function decryptSymmetric(encryptedData: string, key: string, iv: string | undefined, algorithm: string = 'aes-256-cbc'): Promise<string> {
  const keyLength = getKeyLength(algorithm);
  
  let keyBuffer: Buffer;
  if (key.length === keyLength * 2) {
    keyBuffer = Buffer.from(key, 'hex');
  } else {
    keyBuffer = await scryptAsync(key, 'salt', keyLength) as Buffer;
  }
  
  // Use fixed IV if no IV provided
  const ivBuffer = iv ? Buffer.from(iv, 'hex') : getFixedIV(algorithm);
  const decipher = createDecipheriv(algorithm, keyBuffer, ivBuffer);
  
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

export async function simulateSymmetricEncryption(data: string, algorithm: string = 'aes-256-cbc'): Promise<SymmetricEncryptionResult> {
  const key = generateSymmetricKey(algorithm);
  const result = await encryptSymmetric(data, key, algorithm);
  
  return {
    encrypted: result.encrypted,
    key,
    algorithm,
    iv: result.iv
  };
}