"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const crypto_1 = require("crypto");
const rsa_1 = require("./crypto/rsa");
const symmetric_1 = require("./crypto/symmetric");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
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
        const key = (0, symmetric_1.generateSymmetricKey)();
        const iv = (0, crypto_1.randomBytes)(16).toString('hex');
        res.json({ key, algorithm: algorithm || 'aes-256-cbc', iv });
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
app.post('/api/symmetric-decrypt', async (req, res) => {
    try {
        const { encryptedData, key, algorithm, iv } = req.body;
        const decrypted = await (0, symmetric_1.decryptSymmetric)(encryptedData, key, iv, algorithm);
        res.json({ decrypted });
    }
    catch (error) {
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
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to prepare key download' });
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
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map