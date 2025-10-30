export interface SymmetricEncryptionResult {
    encrypted: string;
    key: string;
    algorithm: string;
    iv: string;
}
export declare function generateSymmetricKey(algorithm?: string): string;
export declare function encryptSymmetric(data: string, key: string, algorithm?: string): Promise<{
    encrypted: string;
    iv: string;
}>;
export declare function decryptSymmetric(encryptedData: string, key: string, iv: string | undefined, algorithm?: string): Promise<string>;
export declare function simulateSymmetricEncryption(data: string, algorithm?: string): Promise<SymmetricEncryptionResult>;
//# sourceMappingURL=symmetric.d.ts.map