import { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyHash, generateHash } from '../src/crypto/hash';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { data, expectedHash, algorithm } = req.body;
    
    if (!data || !expectedHash) {
      return res.status(400).json({ error: 'Data and expected hash are required' });
    }
    
    const isValid = verifyHash(data, expectedHash, algorithm || 'sha256');
    const hashResult = generateHash(data, algorithm || 'sha256');
    
    res.json({
      isValid,
      actualHash: hashResult.hash,
      expectedHash,
      algorithm: hashResult.algorithm
    });
  } catch (error) {
    res.status(400).json({ error: 'Failed to verify hash' });
  }
}