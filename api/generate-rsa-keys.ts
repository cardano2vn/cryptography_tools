import { VercelRequest, VercelResponse } from '@vercel/node';
import { generateRSAKeyPair } from '../src/crypto/rsa';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { keySize } = req.body;
    const keys = generateRSAKeyPair(keySize || 2048);
    res.json(keys);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate RSA keys' });
  }
}