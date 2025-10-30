"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const rsa_1 = require("./crypto/rsa");
const symmetric_1 = require("./crypto/symmetric");
const hash_1 = require("./crypto/hash");
const dsa_1 = require("./crypto/dsa");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8080;
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
app.post('/api/generate-rsa-keys', (req, res) => {
    try {
        const { keySize } = req.body;
        const keys = (0, rsa_1.generateRSAKeyPair)(keySize || 2048);
        res.json(keys);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to generate RSA keys' });
    }
});
app.post('/api/rsa-encrypt', (req, res) => {
    try {
        const { data, publicKey } = req.body;
        const encrypted = (0, rsa_1.encryptWithPublicKey)(data, publicKey);
        res.json({ encrypted });
    }
    catch (error) {
        res.status(400).json({ error: 'Failed to encrypt data' });
    }
});
app.post('/api/rsa-decrypt', (req, res) => {
    try {
        const { encryptedData, privateKey } = req.body;
        const decrypted = (0, rsa_1.decryptWithPrivateKey)(encryptedData, privateKey);
        res.json({ decrypted });
    }
    catch (error) {
        res.status(400).json({ error: 'Failed to decrypt data' });
    }
});
app.post('/api/generate-symmetric-key', (req, res) => {
    try {
        const { algorithm } = req.body;
        const selectedAlgorithm = algorithm || 'aes-256-cbc';
        const key = (0, symmetric_1.generateSymmetricKey)(selectedAlgorithm);
        res.json({ key, algorithm: selectedAlgorithm });
    }
    catch (error) {
        res.status(400).json({ error: 'Failed to generate symmetric key' });
    }
});
app.post('/api/symmetric-encrypt', async (req, res) => {
    try {
        const { data, algorithm } = req.body;
        const result = await (0, symmetric_1.simulateSymmetricEncryption)(data, algorithm);
        res.json(result);
    }
    catch (error) {
        res.status(400).json({ error: 'Failed to encrypt data symmetrically' });
    }
});
app.post('/api/symmetric-encrypt-manual', async (req, res) => {
    try {
        const { data, key, algorithm } = req.body;
        if (!data || !key) {
            return res.status(400).json({ error: 'Data and key are required' });
        }
        const result = await (0, symmetric_1.encryptSymmetric)(data, key, algorithm || 'aes-256-cbc');
        res.json({
            encrypted: result.encrypted,
            algorithm: algorithm || 'aes-256-cbc'
        });
    }
    catch (error) {
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
        const decrypted = await (0, symmetric_1.decryptSymmetric)(encryptedData, key, undefined, algorithm || 'aes-256-cbc');
        res.json({ decrypted });
    }
    catch (error) {
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
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to prepare key download' });
    }
});
app.post('/api/hash', (req, res) => {
    try {
        const { data, algorithm } = req.body;
        if (!data) {
            return res.status(400).json({ error: 'Data is required' });
        }
        const result = (0, hash_1.generateHash)(data, algorithm || 'sha256');
        res.json(result);
    }
    catch (error) {
        res.status(400).json({ error: 'Failed to generate hash' });
    }
});
app.post('/api/verify-hash', (req, res) => {
    try {
        const { data, expectedHash, algorithm } = req.body;
        if (!data || !expectedHash) {
            return res.status(400).json({ error: 'Data and expected hash are required' });
        }
        const isValid = (0, hash_1.verifyHash)(data, expectedHash, algorithm || 'sha256');
        const hashResult = (0, hash_1.generateHash)(data, algorithm || 'sha256');
        res.json({
            isValid,
            actualHash: hashResult.hash,
            expectedHash,
            algorithm: hashResult.algorithm
        });
    }
    catch (error) {
        res.status(400).json({ error: 'Failed to verify hash' });
    }
});
app.get('/api/hash-algorithms', (req, res) => {
    try {
        const algorithms = (0, hash_1.getSupportedAlgorithms)();
        const algorithmDetails = algorithms.map(alg => ({
            id: alg,
            ...(0, hash_1.getAlgorithmInfo)(alg)
        }));
        res.json({ algorithms: algorithmDetails });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to get algorithm information' });
    }
});
app.post('/api/generate-dsa-keys', (req, res) => {
    try {
        const keys = (0, dsa_1.generateDSAKeyPair)();
        res.json(keys);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to generate DSA keys' });
    }
});
app.post('/api/dsa-sign', (req, res) => {
    try {
        const { message, privateKey } = req.body;
        if (!message || !privateKey) {
            return res.status(400).json({ error: 'Message and private key are required' });
        }
        const signature = (0, dsa_1.signMessage)(message, privateKey);
        res.json({ signature });
    }
    catch (error) {
        res.status(400).json({ error: 'Failed to sign message' });
    }
});
app.post('/api/dsa-verify', (req, res) => {
    try {
        const { message, signature, publicKey } = req.body;
        if (!message || !signature || !publicKey) {
            return res.status(400).json({ error: 'Message, signature, and public key are required' });
        }
        const isValid = (0, dsa_1.verifySignature)(message, signature, publicKey);
        res.json({ isValid });
    }
    catch (error) {
        res.status(400).json({ error: 'Failed to verify signature' });
    }
});
app.post('/api/dsa-simulate', (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }
        const result = (0, dsa_1.simulateDSAOperation)(message);
        res.json(result);
    }
    catch (error) {
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
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to prepare DSA key download' });
    }
});
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../public/symmetric.html'));
});
app.get('/rsa', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../public/index.html'));
});
app.get('/symmetric', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../public/symmetric.html'));
});
app.get('/hash', (_req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../public/hash.html'));
});
app.get('/dsa', (_req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../public/dsa.html'));
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map