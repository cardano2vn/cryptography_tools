import { VercelRequest, VercelResponse } from '@vercel/node';
import { generateSymmetricKey } from '../src/crypto/symmetric';
import { randomBytes } from 'crypto';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { algorithm } = req.body;
    const key = generateSymmetricKey();
    const iv = randomBytes(16).toString('hex');
    res.json({ key, algorithm: algorithm || 'aes-256-cbc', iv });
  } catch (error) {
    res.status(400).json({ error: 'Failed to generate symmetric key' });
  }
}