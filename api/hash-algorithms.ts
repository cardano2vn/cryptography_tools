import { VercelRequest, VercelResponse } from '@vercel/node';
import { getSupportedAlgorithms, getAlgorithmInfo } from '../src/crypto/hash';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const algorithms = getSupportedAlgorithms();
    const algorithmDetails = algorithms.map(alg => ({
      id: alg,
      ...getAlgorithmInfo(alg)
    }));
    
    res.json({ algorithms: algorithmDetails });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get algorithm information' });
  }
}