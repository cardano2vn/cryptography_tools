# RSA Cryptography Website

A comprehensive web application demonstrating RSA encryption, symmetric encryption, and hash functions built with TypeScript and designed for Vercel deployment.

## Features

- **RSA Encryption/Decryption**: Generate RSA key pairs and encrypt/decrypt data
- **Symmetric Encryption**: Support for AES-256-CBC, AES-192-CBC, AES-128-CBC, and 3DES-EDE3-CBC
- **Hash Functions**: SHA-256, SHA-512, SHA-1, MD5, SHA3-256, SHA3-512, and BLAKE2b-512
- **Interactive UI**: User-friendly web interface for all cryptographic operations
- **Educational Content**: Explanations of cryptographic concepts and security best practices

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