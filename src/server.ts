import express from 'express';
import path from 'path';
import { randomBytes } from 'crypto';
import { generateRSAKeyPair, encryptWithPublicKey, decryptWithPrivateKey } from './crypto/rsa';
import { simulateSymmetricEncryption, encryptSymmetric, decryptSymmetric, generateSymmetricKey } from './crypto/symmetric';

const app = express();
const PORT = process.env.PORT || 3000;

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
    const key = generateSymmetricKey();
    const iv = randomBytes(16).toString('hex');
    res.json({ key, algorithm: algorithm || 'aes-256-cbc', iv });
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

app.post('/api/symmetric-decrypt', async (req, res) => {
  try {
    const { encryptedData, key, algorithm, iv } = req.body;
    const decrypted = await decryptSymmetric(encryptedData, key, iv, algorithm);
    res.json({ decrypted });
  } catch (error) {
    res.status(400).json({ error: 'Failed to decrypt data symmetrically' });
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

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/symmetric.html'));
});

app.get('/rsa', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/symmetric', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/symmetric.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});