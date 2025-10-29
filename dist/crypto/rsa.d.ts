export interface RSAKeyPair {
    publicKey: string;
    privateKey: string;
}
export declare function generateRSAKeyPair(keySize?: number): RSAKeyPair;
export declare function encryptWithPublicKey(data: string, publicKey: string): string;
export declare function decryptWithPrivateKey(encryptedData: string, privateKey: string): string;
//# sourceMappingURL=rsa.d.ts.map