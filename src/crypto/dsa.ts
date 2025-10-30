import { randomBytes, createHash } from 'crypto';

interface DSAKeyPair {
  publicKey: DSAPublicKey;
  privateKey: DSAPrivateKey;
}

interface DSAPublicKey {
  p: string;
  q: string;
  g: string;
  y: string;
}

interface DSAPrivateKey {
  p: string;
  q: string;
  g: string;
  x: string;
}

interface DSASignature {
  r: string;
  s: string;
}

function modPow(base: bigint, exponent: bigint, modulus: bigint): bigint {
  let result = 1n;
  base = base % modulus;
  while (exponent > 0n) {
    if (exponent % 2n === 1n) {
      result = (result * base) % modulus;
    }
    exponent = exponent >> 1n;
    base = (base * base) % modulus;
  }
  return result;
}

function isPrime(n: bigint, k: number = 5): boolean {
  if (n < 2n) return false;
  if (n === 2n || n === 3n) return true;
  if (n % 2n === 0n) return false;

  let r = 0n;
  let d = n - 1n;
  while (d % 2n === 0n) {
    d /= 2n;
    r++;
  }

  for (let i = 0; i < k; i++) {
    const a = 2n + BigInt(Math.floor(Math.random() * Number(n - 4n)));
    let x = modPow(a, d, n);
    
    if (x === 1n || x === n - 1n) continue;
    
    for (let j = 0n; j < r - 1n; j++) {
      x = modPow(x, 2n, n);
      if (x === n - 1n) break;
    }
    
    if (x !== n - 1n) return false;
  }
  
  return true;
}

function generatePrime(bits: number): bigint {
  while (true) {
    const candidate = BigInt('0x' + randomBytes(Math.ceil(bits / 8)).toString('hex'));
    const adjustedCandidate = candidate | (1n << BigInt(bits - 1)) | 1n;
    if (isPrime(adjustedCandidate)) {
      return adjustedCandidate;
    }
  }
}

function generateQ(): bigint {
  // Use a smaller, fixed prime for demonstration to avoid long computation
  return 1009n; // A small prime for demo purposes
}

function generateP(q: bigint): bigint {
  // Use a fixed p that satisfies (p-1) % q == 0 for demonstration
  return q * 2n + 1n; // Simple formula ensuring (p-1) % q == 0
}

function generateG(p: bigint, q: bigint): bigint {
  const h = 2n;
  return modPow(h, (p - 1n) / q, p);
}

function hashToInteger(message: string): bigint {
  const hash = createHash('sha1').update(message).digest('hex');
  return BigInt('0x' + hash);
}

function modInverse(a: bigint, m: bigint): bigint {
  if (a < 0n) a = (a % m + m) % m;
  
  const extendedGCD = (a: bigint, b: bigint): [bigint, bigint, bigint] => {
    if (a === 0n) return [b, 0n, 1n];
    const [gcd, x1, y1] = extendedGCD(b % a, a);
    const x = y1 - (b / a) * x1;
    const y = x1;
    return [gcd, x, y];
  };
  
  const [gcd, x] = extendedGCD(a, m);
  if (gcd !== 1n) throw new Error('Modular inverse does not exist');
  return (x % m + m) % m;
}

export function generateDSAKeyPair(): DSAKeyPair {
  const q = generateQ();
  const p = generateP(q);
  const g = generateG(p, q);
  
  const x = BigInt('0x' + randomBytes(20).toString('hex')) % q;
  const y = modPow(g, x, p);
  
  return {
    publicKey: {
      p: p.toString(16),
      q: q.toString(16),
      g: g.toString(16),
      y: y.toString(16)
    },
    privateKey: {
      p: p.toString(16),
      q: q.toString(16),
      g: g.toString(16),
      x: x.toString(16)
    }
  };
}

export function signMessage(message: string, privateKey: DSAPrivateKey): DSASignature {
  const p = BigInt('0x' + privateKey.p);
  const q = BigInt('0x' + privateKey.q);
  const g = BigInt('0x' + privateKey.g);
  const x = BigInt('0x' + privateKey.x);
  
  const h = hashToInteger(message);
  
  let r = 0n;
  let s = 0n;
  
  while (r === 0n || s === 0n) {
    const k = BigInt('0x' + randomBytes(20).toString('hex')) % q;
    r = modPow(g, k, p) % q;
    
    if (r === 0n) continue;
    
    const kInv = modInverse(k, q);
    s = (kInv * (h + x * r)) % q;
  }
  
  return {
    r: r.toString(16),
    s: s.toString(16)
  };
}

export function verifySignature(message: string, signature: DSASignature, publicKey: DSAPublicKey): boolean {
  try {
    const p = BigInt('0x' + publicKey.p);
    const q = BigInt('0x' + publicKey.q);
    const g = BigInt('0x' + publicKey.g);
    const y = BigInt('0x' + publicKey.y);
    
    const r = BigInt('0x' + signature.r);
    const s = BigInt('0x' + signature.s);
    
    if (r <= 0n || r >= q || s <= 0n || s >= q) {
      return false;
    }
    
    const h = hashToInteger(message);
    const w = modInverse(s, q);
    const u1 = (h * w) % q;
    const u2 = (r * w) % q;
    
    const v = ((modPow(g, u1, p) * modPow(y, u2, p)) % p) % q;
    
    return v === r;
  } catch (error) {
    return false;
  }
}

export function simulateDSAOperation(message: string) {
  const keyPair = generateDSAKeyPair();
  const signature = signMessage(message, keyPair.privateKey);
  const isValid = verifySignature(message, signature, keyPair.publicKey);
  
  return {
    keyPair,
    signature,
    isValid,
    message
  };
}