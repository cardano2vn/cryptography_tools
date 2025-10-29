import { createHash } from 'crypto';

export interface HashResult {
  hash: string;
  algorithm: string;
  inputLength: number;
  outputLength: number;
}

export function generateHash(data: string, algorithm: string = 'sha256'): HashResult {
  const hash = createHash(algorithm);
  hash.update(data, 'utf8');
  const hashValue = hash.digest('hex');
  
  return {
    hash: hashValue,
    algorithm: algorithm.toUpperCase(),
    inputLength: data.length,
    outputLength: hashValue.length
  };
}

export function verifyHash(data: string, expectedHash: string, algorithm: string = 'sha256'): boolean {
  const result = generateHash(data, algorithm);
  return result.hash.toLowerCase() === expectedHash.toLowerCase();
}

export function getSupportedAlgorithms(): string[] {
  return [
    'md5',
    'sha1', 
    'sha256',
    'sha512',
    'sha3-256',
    'sha3-512',
    'blake2b512'
  ];
}

export function getAlgorithmInfo(algorithm: string): { name: string; outputSize: number; securityStatus: string; description: string } {
  const info: Record<string, { name: string; outputSize: number; securityStatus: string; description: string }> = {
    'md5': {
      name: 'MD5',
      outputSize: 128,
      securityStatus: 'Broken',
      description: 'Fast but cryptographically broken. Should not be used for security purposes.'
    },
    'sha1': {
      name: 'SHA-1',
      outputSize: 160,
      securityStatus: 'Deprecated',
      description: 'Deprecated due to known vulnerabilities. Being phased out.'
    },
    'sha256': {
      name: 'SHA-256',
      outputSize: 256,
      securityStatus: 'Secure',
      description: 'Part of SHA-2 family. Widely used and trusted for security applications.'
    },
    'sha512': {
      name: 'SHA-512',
      outputSize: 512,
      securityStatus: 'Secure',
      description: 'Longer version of SHA-2. Provides higher security margin.'
    },
    'sha3-256': {
      name: 'SHA3-256',
      outputSize: 256,
      securityStatus: 'Secure',
      description: 'Latest NIST standard with different algorithm design from SHA-2.'
    },
    'sha3-512': {
      name: 'SHA3-512',
      outputSize: 512,
      securityStatus: 'Secure',
      description: 'Longer version of SHA-3 with very high security.'
    },
    'blake2b512': {
      name: 'BLAKE2b-512',
      outputSize: 512,
      securityStatus: 'Secure',
      description: 'High-performance cryptographic hash, faster than SHA-2/3.'
    }
  };
  
  return info[algorithm] || {
    name: algorithm.toUpperCase(),
    outputSize: 0,
    securityStatus: 'Unknown',
    description: 'Unknown algorithm'
  };
}