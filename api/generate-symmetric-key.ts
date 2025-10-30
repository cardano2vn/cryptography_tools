import { VercelRequest, VercelResponse } from '@vercel/node';
import { generateSymmetricKey } from '../src/crypto/symmetric';
import { randomBytes } from 'crypto';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { algorithm } = req.body;
    const selectedAlgorithm = algorithm || 'aes-256-cbc';
    const key = generateSymmetricKey(selectedAlgorithm);
    
    function getIVLength(alg: string): number {
      switch (alg) {
        case 'aes-256-cbc':
        case 'aes-192-cbc':
        case 'aes-128-cbc':
          return 16;
        case 'des-ede3-cbc':
          return 8;
        default:
          return 16;
      }
    }
    
    const ivLength = getIVLength(selectedAlgorithm);
    const iv = randomBytes(ivLength).toString('hex');
    res.json({ key, algorithm: selectedAlgorithm, iv });
  } catch (error) {
    res.status(400).json({ error: 'Failed to generate symmetric key' });
  }
}