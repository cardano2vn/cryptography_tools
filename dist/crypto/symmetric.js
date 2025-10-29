"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSymmetricKey = generateSymmetricKey;
exports.encryptSymmetric = encryptSymmetric;
exports.decryptSymmetric = decryptSymmetric;
exports.simulateSymmetricEncryption = simulateSymmetricEncryption;
const crypto_1 = require("crypto");
const util_1 = require("util");
const scryptAsync = (0, util_1.promisify)(crypto_1.scrypt);
function generateSymmetricKey(length = 32) {
    return (0, crypto_1.randomBytes)(length).toString('hex');
}
async function encryptSymmetric(data, key, algorithm = 'aes-256-cbc') {
    const iv = (0, crypto_1.randomBytes)(16);
    const derivedKey = await scryptAsync(key, 'salt', 32);
    const cipher = (0, crypto_1.createCipheriv)(algorithm, derivedKey, iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return {
        encrypted,
        iv: iv.toString('hex')
    };
}
async function decryptSymmetric(encryptedData, key, iv, algorithm = 'aes-256-cbc') {
    const derivedKey = await scryptAsync(key, 'salt', 32);
    const decipher = (0, crypto_1.createDecipheriv)(algorithm, derivedKey, Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}
async function simulateSymmetricEncryption(data, algorithm = 'aes-256-cbc') {
    const key = generateSymmetricKey();
    const result = await encryptSymmetric(data, key, algorithm);
    return {
        encrypted: result.encrypted,
        key,
        algorithm,
        iv: result.iv
    };
}
//# sourceMappingURL=symmetric.js.map