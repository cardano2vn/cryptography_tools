import { VercelRequest, VercelResponse } from '@vercel/node';
import { encryptSymmetric } from '../src/crypto/symmetric';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { data, key, algorithm } = req.body;
    
    if (!data || !key) {
      return res.status(400).json({ error: 'Data and key are required' });
    }
    
    const result = await encryptSymmetric(data, key, algorithm || 'aes-256-cbc');
    res.json({
      encrypted: result.encrypted,
      iv: result.iv,
      algorithm: algorithm || 'aes-256-cbc'
    });
  } catch (error) {
    res.status(400).json({ error: 'Failed to encrypt data' });
  }
}