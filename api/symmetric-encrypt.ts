import { VercelRequest, VercelResponse } from '@vercel/node';
import { simulateSymmetricEncryption } from '../src/crypto/symmetric';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { data, algorithm } = req.body;
    const result = await simulateSymmetricEncryption(data, algorithm);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: 'Failed to encrypt data symmetrically' });
  }
}