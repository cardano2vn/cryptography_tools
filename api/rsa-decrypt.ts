import { VercelRequest, VercelResponse } from '@vercel/node';
import { decryptWithPrivateKey } from '../src/crypto/rsa';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { encryptedData, privateKey } = req.body;
    const decrypted = decryptWithPrivateKey(encryptedData, privateKey);
    res.json({ decrypted });
  } catch (error) {
    res.status(400).json({ error: 'Failed to decrypt data' });
  }
}