// src/lib/crypto.ts

export interface EncryptedData {
  ct: string; // Ciphertext (Base64)
  iv: string; // Initialization Vector (Base64)
  s: string;  // Salt (Base64)
}

function getCrypto() {
  if (typeof window !== 'undefined' && window.crypto) {
    return window.crypto;
  }
  // Fallback for Node.js environment (for testing)
  return require('crypto').webcrypto;
}

const crypto = getCrypto();

// Convert a string to an ArrayBuffer
function str2ab(str: string): ArrayBuffer {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

// Convert an ArrayBuffer to a Base64 string
function ab2base64(buf: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buf);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  if (typeof window !== 'undefined') {
      return window.btoa(binary);
  }
  return btoa(binary);
}

// Convert a Base64 string to an ArrayBuffer
function base642ab(base64: string): ArrayBuffer {
    let binary_string;
    if (typeof window !== 'undefined') {
        binary_string = window.atob(base64);
    } else {
        binary_string = atob(base64);
    }
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}

// Generate a cryptographic key from a password and salt using PBKDF2
async function getKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256"
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false, // Key is not extractable
    ["encrypt", "decrypt"]
  );
}

export async function encryptData(data: any, password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await getKey(password, salt);
  const enc = new TextEncoder();
  const encodedData = enc.encode(JSON.stringify(data));

  const ciphertext = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv
    },
    key,
    encodedData
  );

  const encryptedObj: EncryptedData = {
    ct: ab2base64(ciphertext),
    iv: ab2base64(iv),
    s: ab2base64(salt)
  };

  return JSON.stringify(encryptedObj);
}

export async function decryptData(encryptedJson: string, password: string): Promise<any> {
  const encryptedObj: EncryptedData = JSON.parse(encryptedJson);

  if (!encryptedObj.ct || !encryptedObj.iv || !encryptedObj.s) {
    throw new Error("Invalid encrypted data format");
  }

  const salt = new Uint8Array(base642ab(encryptedObj.s));
  const iv = new Uint8Array(base642ab(encryptedObj.iv));
  const ciphertext = base642ab(encryptedObj.ct);
  const key = await getKey(password, salt);

  try {
    const decrypted = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv
      },
      key,
      ciphertext
    );

    const dec = new TextDecoder();
    return JSON.parse(dec.decode(decrypted));
  } catch (e) {
    throw new Error("Decryption failed. Incorrect password or corrupted data.");
  }
}
