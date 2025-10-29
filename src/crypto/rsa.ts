import { generateKeyPairSync, publicEncrypt, privateDecrypt, constants } from 'crypto';

export interface RSAKeyPair {
  publicKey: string;
  privateKey: string;
}

export function generateRSAKeyPair(keySize: number = 2048): RSAKeyPair {
  const { publicKey, privateKey } = generateKeyPairSync('rsa', {
    modulusLength: keySize,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem'
    }
  });

  return {
    publicKey,
    privateKey
  };
}

export function encryptWithPublicKey(data: string, publicKey: string): string {
  const buffer = Buffer.from(data, 'utf8');
  const encrypted = publicEncrypt(
    {
      key: publicKey,
      padding: constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256'
    },
    buffer
  );
  return encrypted.toString('base64');
}

export function decryptWithPrivateKey(encryptedData: string, privateKey: string): string {
  const buffer = Buffer.from(encryptedData, 'base64');
  const decrypted = privateDecrypt(
    {
      key: privateKey,
      padding: constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256'
    },
    buffer
  );
  return decrypted.toString('utf8');
}