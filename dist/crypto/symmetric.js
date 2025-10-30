"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSymmetricKey = generateSymmetricKey;
exports.encryptSymmetric = encryptSymmetric;
exports.decryptSymmetric = decryptSymmetric;
exports.simulateSymmetricEncryption = simulateSymmetricEncryption;
const crypto_1 = require("crypto");
const util_1 = require("util");
const scryptAsync = (0, util_1.promisify)(crypto_1.scrypt);
function getKeyLength(algorithm) {
    switch (algorithm) {
        case 'aes-256-cbc':
            return 32;
        case 'aes-192-cbc':
            return 24;
        case 'aes-128-cbc':
            return 16;
        case 'des-ede3-cbc':
            return 24;
        default:
            return 32;
    }
}
function getIVLength(algorithm) {
    switch (algorithm) {
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
function getFixedIV(algorithm) {
    const ivLength = getIVLength(algorithm);
    // Use a fixed IV for consistent encryption/decryption
    const fixedIVHex = algorithm === 'des-ede3-cbc' ? '0123456789abcdef' : '0123456789abcdef0123456789abcdef';
    return Buffer.from(fixedIVHex.slice(0, ivLength * 2), 'hex');
}
function generateSymmetricKey(algorithm = 'aes-256-cbc') {
    const length = getKeyLength(algorithm);
    return (0, crypto_1.randomBytes)(length).toString('hex');
}
async function encryptSymmetric(data, key, algorithm = 'aes-256-cbc') {
    const keyLength = getKeyLength(algorithm);
    const iv = getFixedIV(algorithm);
    let keyBuffer;
    if (key.length === keyLength * 2) {
        keyBuffer = Buffer.from(key, 'hex');
    }
    else {
        keyBuffer = await scryptAsync(key, 'salt', keyLength);
    }
    const cipher = (0, crypto_1.createCipheriv)(algorithm, keyBuffer, iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return {
        encrypted,
        iv: iv.toString('hex')
    };
}
async function decryptSymmetric(encryptedData, key, iv, algorithm = 'aes-256-cbc') {
    const keyLength = getKeyLength(algorithm);
    let keyBuffer;
    if (key.length === keyLength * 2) {
        keyBuffer = Buffer.from(key, 'hex');
    }
    else {
        keyBuffer = await scryptAsync(key, 'salt', keyLength);
    }
    // Use fixed IV if no IV provided
    const ivBuffer = iv ? Buffer.from(iv, 'hex') : getFixedIV(algorithm);
    const decipher = (0, crypto_1.createDecipheriv)(algorithm, keyBuffer, ivBuffer);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}
async function simulateSymmetricEncryption(data, algorithm = 'aes-256-cbc') {
    const key = generateSymmetricKey(algorithm);
    const result = await encryptSymmetric(data, key, algorithm);
    return {
        encrypted: result.encrypted,
        key,
        algorithm,
        iv: result.iv
    };
}
//# sourceMappingURL=symmetric.js.map