import { VercelRequest, VercelResponse } from '@vercel/node';
import { decryptSymmetric } from '../src/crypto/symmetric';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { encryptedData, key, algorithm, iv } = req.body;
    const decrypted = await decryptSymmetric(encryptedData, key, iv, algorithm);
    res.json({ decrypted });
  } catch (error) {
    res.status(400).json({ error: 'Failed to decrypt data symmetrically' });
  }
}