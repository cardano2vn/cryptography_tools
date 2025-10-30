import express from 'express';
import path from 'path';
import { randomBytes } from 'crypto';
import { generateRSAKeyPair, encryptWithPublicKey, decryptWithPrivateKey } from './crypto/rsa';
import { simulateSymmetricEncryption, encryptSymmetric, decryptSymmetric, generateSymmetricKey } from './crypto/symmetric';
import { generateHash, verifyHash, getSupportedAlgorithms, getAlgorithmInfo } from './crypto/hash';
import { generateDSAKeyPair, signMessage, verifySignature, simulateDSAOperation } from './crypto/dsa';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

app.post('/api/generate-rsa-keys', (req, res) => {
  try {
    const { keySize } = req.body;
    const keys = generateRSAKeyPair(keySize || 2048);
    res.json(keys);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate RSA keys' });
  }
});

app.post('/api/rsa-encrypt', (req, res) => {
  try {
    const { data, publicKey } = req.body;
    const encrypted = encryptWithPublicKey(data, publicKey);
    res.json({ encrypted });
  } catch (error) {
    res.status(400).json({ error: 'Failed to encrypt data' });
  }
});

app.post('/api/rsa-decrypt', (req, res) => {
  try {
    const { encryptedData, privateKey } = req.body;
    const decrypted = decryptWithPrivateKey(encryptedData, privateKey);
    res.json({ decrypted });
  } catch (error) {
    res.status(400).json({ error: 'Failed to decrypt data' });
  }
});

app.post('/api/generate-symmetric-key', (req, res) => {
  try {
    const { algorithm } = req.body;
    const selectedAlgorithm = algorithm || 'aes-256-cbc';
    const key = generateSymmetricKey(selectedAlgorithm);
    
    res.json({ key, algorithm: selectedAlgorithm });
  } catch (error) {
    res.status(400).json({ error: 'Failed to generate symmetric key' });
  }
});

app.post('/api/symmetric-encrypt', async (req, res) => {
  try {
    const { data, algorithm } = req.body;
    const result = await simulateSymmetricEncryption(data, algorithm);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: 'Failed to encrypt data symmetrically' });
  }
});

app.post('/api/symmetric-encrypt-manual', async (req, res) => {
  try {
    const { data, key, algorithm } = req.body;
    
    if (!data || !key) {
      return res.status(400).json({ error: 'Data and key are required' });
    }
    
    const result = await encryptSymmetric(data, key, algorithm || 'aes-256-cbc');
    res.json({
      encrypted: result.encrypted,
      algorithm: algorithm || 'aes-256-cbc'
    });
  } catch (error: any) {
    console.error('Encryption error:', error);
    res.status(400).json({ error: `Failed to encrypt data: ${error.message}` });
  }
});

app.post('/api/symmetric-decrypt', async (req, res) => {
  try {
    const { encryptedData, key, algorithm } = req.body;
    
    if (!encryptedData || !key) {
      return res.status(400).json({ error: 'Encrypted data and key are required' });
    }
    
    const decrypted = await decryptSymmetric(encryptedData, key, undefined, algorithm || 'aes-256-cbc');
    res.json({ decrypted });
  } catch (error: any) {
    console.error('Decryption error:', error);
    res.status(400).json({ error: `Failed to decrypt data: ${error.message}` });
  }
});

app.post('/api/download-keys', (req, res) => {
  try {
    const { publicKey, privateKey, filename } = req.body;
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${filename || 'rsa-keys'}.json"`);
    
    res.json({
      publicKey,
      privateKey,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to prepare key download' });
  }
});

app.post('/api/hash', (req, res) => {
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
});

app.post('/api/verify-hash', (req, res) => {
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
});

app.get('/api/hash-algorithms', (req, res) => {
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
});

app.post('/api/generate-dsa-keys', (req, res) => {
  try {
    const keys = generateDSAKeyPair();
    res.json(keys);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate DSA keys' });
  }
});

app.post('/api/dsa-sign', (req, res) => {
  try {
    const { message, privateKey } = req.body;
    
    if (!message || !privateKey) {
      return res.status(400).json({ error: 'Message and private key are required' });
    }
    
    const signature = signMessage(message, privateKey);
    res.json({ signature });
  } catch (error) {
    res.status(400).json({ error: 'Failed to sign message' });
  }
});

app.post('/api/dsa-verify', (req, res) => {
  try {
    const { message, signature, publicKey } = req.body;
    
    if (!message || !signature || !publicKey) {
      return res.status(400).json({ error: 'Message, signature, and public key are required' });
    }
    
    const isValid = verifySignature(message, signature, publicKey);
    res.json({ isValid });
  } catch (error) {
    res.status(400).json({ error: 'Failed to verify signature' });
  }
});

app.post('/api/dsa-simulate', (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    const result = simulateDSAOperation(message);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to run DSA simulation' });
  }
});

app.post('/api/download-dsa-keys', (req, res) => {
  try {
    const { publicKey, privateKey, filename } = req.body;
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${filename || 'dsa-keys'}.json"`);
    
    res.json({
      publicKey,
      privateKey,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to prepare DSA key download' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/symmetric.html'));
});

app.get('/rsa', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/symmetric', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/symmetric.html'));
});

app.get('/hash', (_req, res) => {
  res.sendFile(path.join(__dirname, '../public/hash.html'));
});

app.get('/dsa', (_req, res) => {
  res.sendFile(path.join(__dirname, '../public/dsa.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});