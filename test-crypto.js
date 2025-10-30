const { encryptSymmetric, decryptSymmetric, generateSymmetricKey } = require('./src/crypto/symmetric');

async function testSymmetricCrypto() {
  console.log('Testing symmetric encryption/decryption...');
  
  try {
    const algorithm = 'aes-256-cbc';
    const testData = 'Hello, World!';
    const key = generateSymmetricKey(algorithm);
    
    console.log('Generated key:', key);
    console.log('Key length:', key.length);
    console.log('Test data:', testData);
    
    // Encrypt
    const encrypted = await encryptSymmetric(testData, key, algorithm);
    console.log('Encrypted:', encrypted);
    
    // Decrypt
    const decrypted = await decryptSymmetric(encrypted.encrypted, key, encrypted.iv, algorithm);
    console.log('Decrypted:', decrypted);
    
    console.log('Success:', testData === decrypted);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testSymmetricCrypto();