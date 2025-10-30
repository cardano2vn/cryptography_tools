// Simple test to check if DSA functions work
const { generateDSAKeyPair, signMessage, verifySignature } = require('./dist/crypto/dsa');

try {
  console.log('Testing DSA key generation...');
  const keys = generateDSAKeyPair();
  console.log('Keys generated successfully');
  
  console.log('Testing DSA signing...');
  const message = "Hello World";
  const signature = signMessage(message, keys.privateKey);
  console.log('Message signed successfully');
  
  console.log('Testing DSA verification...');
  const isValid = verifySignature(message, signature, keys.publicKey);
  console.log('Verification result:', isValid);
  
  console.log('DSA test completed successfully');
} catch (error) {
  console.error('DSA test failed:', error);
}