import { VercelRequest, VercelResponse } from '@vercel/node';
import { generateHash } from '../src/crypto/hash';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { data, algorithm } = req.body;
    
    if (!data) {
      return res.status(400).json({ error: 'Data is required' });
    }
    
    const result = generateHash(data, algorithm || 'sha256');
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: 'Failed to generate hash' });
  }
}