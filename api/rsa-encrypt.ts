import { VercelRequest, VercelResponse } from '@vercel/node';
import { encryptWithPublicKey } from '../src/crypto/rsa';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { data, publicKey } = req.body;
    const encrypted = encryptWithPublicKey(data, publicKey);
    res.json({ encrypted });
  } catch (error) {
    res.status(400).json({ error: 'Failed to encrypt data' });
  }
}