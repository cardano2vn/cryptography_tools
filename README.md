# Cryptography Tools - User Manual

A comprehensive web-based cryptography toolkit for educational and demonstration purposes, featuring RSA, Symmetric Encryption, Hash Functions, and Digital Signature Algorithm (DSA) implementations.

## Table of Contents

- [Overview](#overview)
- [Installation & Setup](#installation--setup)
- [Getting Started](#getting-started)
- [Tool Descriptions](#tool-descriptions)
  - [RSA Cryptography](#rsa-cryptography)
  - [Symmetric Encryption](#symmetric-encryption)
  - [Hash Functions](#hash-functions)
  - [Digital Signature Algorithm (DSA)](#digital-signature-algorithm-dsa)
- [API Reference](#api-reference)
- [Security Considerations](#security-considerations)
- [Troubleshooting](#troubleshooting)
- [Technical Specifications](#technical-specifications)

## Overview

This cryptography toolkit provides a user-friendly web interface for understanding and experimenting with fundamental cryptographic operations. Each tool is designed for educational purposes and includes step-by-step operations to help users learn how different cryptographic algorithms work.

### Features

- **RSA Encryption/Decryption**: Generate key pairs, encrypt and decrypt messages
- **Symmetric Encryption**: Support for multiple algorithms (AES, DES, 3DES, etc.)
- **Hash Functions**: Generate and verify cryptographic hashes
- **Digital Signatures (DSA)**: Create and verify digital signatures
- **Key Management**: Download and manage cryptographic keys
- **Educational Interface**: Clear explanations and demonstrations

## Project Structure

```
├── api/                    # Vercel serverless functions
│   ├── generate-rsa-keys.ts
│   ├── rsa-encrypt.ts
│   ├── rsa-decrypt.ts
│   ├── symmetric-encrypt.ts
│   ├── symmetric-decrypt.ts
│   ├── hash.ts
│   └── ...
├── public/                 # Static files
│   ├── index.html         # RSA page
│   ├── symmetric.html     # Symmetric encryption page
│   └── hash.html          # Hash functions page
├── src/                   # Source code (for local development)
│   ├── crypto/
│   │   ├── rsa.ts
│   │   ├── symmetric.ts
│   │   └── hash.ts
│   └── server.ts
├── vercel.json           # Vercel configuration
└── package.json
```

## Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run locally with Express server**:
   ```bash
   npm run dev
   ```

3. **Build TypeScript**:
   ```bash
   npm run build
   ```

4. **Start production server**:
   ```bash
   npm start
   ```

## Vercel Deployment

### Prerequisites

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

### Deploy to Vercel

1. **Initialize Vercel project**:
   ```bash
   vercel
   ```
   Follow the prompts to set up your project.

2. **Deploy to production**:
   ```bash
   vercel --prod
   ```
   
   Or use the npm script:
   ```bash
   npm run deploy
   ```

### Automatic Deployment

For automatic deployments, connect your GitHub repository to Vercel:

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will automatically detect the configuration and deploy

### Environment Variables

No environment variables are required for basic functionality. All cryptographic operations run in the browser or serverless functions.

## API Endpoints

### RSA Operations
- `POST /api/generate-rsa-keys` - Generate RSA key pair
- `POST /api/rsa-encrypt` - Encrypt data with public key
- `POST /api/rsa-decrypt` - Decrypt data with private key
- `POST /api/download-keys` - Download key pair as JSON

### Symmetric Encryption
- `POST /api/generate-symmetric-key` - Generate symmetric key
- `POST /api/symmetric-encrypt` - Encrypt data symmetrically
- `POST /api/symmetric-decrypt` - Decrypt data symmetrically

### Hash Functions
- `POST /api/hash` - Generate hash of input data
- `POST /api/verify-hash` - Verify hash against expected value
- `GET /api/hash-algorithms` - Get supported algorithms info

## Pages

- `/` - Home page (Symmetric encryption)
- `/rsa` - RSA encryption/decryption
- `/symmetric` - Symmetric encryption operations
- `/hash` - Hash function tools

## Security Notes

- This is an educational tool for demonstrating cryptographic concepts
- Private keys are generated and used client-side only
- No sensitive data is stored on the server
- For production use, implement proper key management and security practices

## Technologies Used

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, TypeScript
- **Deployment**: Vercel Serverless Functions
- **Cryptography**: Node.js Crypto module

## License

MIT License - see LICENSE file for details