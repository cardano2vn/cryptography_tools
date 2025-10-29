"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRSAKeyPair = generateRSAKeyPair;
exports.encryptWithPublicKey = encryptWithPublicKey;
exports.decryptWithPrivateKey = decryptWithPrivateKey;
const crypto_1 = require("crypto");
function generateRSAKeyPair(keySize = 2048) {
    const { publicKey, privateKey } = (0, crypto_1.generateKeyPairSync)('rsa', {
        modulusLength: keySize,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem'
        }
    });
    return {
        publicKey,
        privateKey
    };
}
function encryptWithPublicKey(data, publicKey) {
    const buffer = Buffer.from(data, 'utf8');
    const encrypted = (0, crypto_1.publicEncrypt)({
        key: publicKey,
        padding: crypto_1.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256'
    }, buffer);
    return encrypted.toString('base64');
}
function decryptWithPrivateKey(encryptedData, privateKey) {
    const buffer = Buffer.from(encryptedData, 'base64');
    const decrypted = (0, crypto_1.privateDecrypt)({
        key: privateKey,
        padding: crypto_1.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256'
    }, buffer);
    return decrypted.toString('utf8');
}
//# sourceMappingURL=rsa.js.map