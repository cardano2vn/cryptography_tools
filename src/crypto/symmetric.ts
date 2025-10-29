import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

export interface SymmetricEncryptionResult {
  encrypted: string;
  key: string;
  algorithm: string;
  iv: string;
}

export function generateSymmetricKey(length: number = 32): string {
  return randomBytes(length).toString('hex');
}

export async function encryptSymmetric(data: string, key: string, algorithm: string = 'aes-256-cbc'): Promise<{ encrypted: string; iv: string }> {
  const iv = randomBytes(16);
  const derivedKey = await scryptAsync(key, 'salt', 32) as Buffer;
  const cipher = createCipheriv(algorithm, derivedKey, iv);
  
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return {
    encrypted,
    iv: iv.toString('hex')
  };
}

export async function decryptSymmetric(encryptedData: string, key: string, iv: string, algorithm: string = 'aes-256-cbc'): Promise<string> {
  const derivedKey = await scryptAsync(key, 'salt', 32) as Buffer;
  const decipher = createDecipheriv(algorithm, derivedKey, Buffer.from(iv, 'hex'));
  
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

export async function simulateSymmetricEncryption(data: string, algorithm: string = 'aes-256-cbc'): Promise<SymmetricEncryptionResult> {
  const key = generateSymmetricKey();
  const result = await encryptSymmetric(data, key, algorithm);
  
  return {
    encrypted: result.encrypted,
    key,
    algorithm,
    iv: result.iv
  };
}