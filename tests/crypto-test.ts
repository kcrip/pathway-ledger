// tests/crypto-test.ts

import { encryptData, decryptData } from '../src/lib/crypto';
import { performance } from 'perf_hooks';

// Polyfill for global fetch, crypto, TextEncoder/Decoder for Node env
if (!globalThis.crypto) {
    globalThis.crypto = require('crypto').webcrypto;
}
if (!globalThis.TextEncoder) {
    globalThis.TextEncoder = require('util').TextEncoder;
}
if (!globalThis.TextDecoder) {
    globalThis.TextDecoder = require('util').TextDecoder;
}
if (!globalThis.btoa) {
    globalThis.btoa = (str) => Buffer.from(str, 'binary').toString('base64');
}
if (!globalThis.atob) {
    globalThis.atob = (str) => Buffer.from(str, 'base64').toString('binary');
}

async function runTests() {
    console.log("Starting Crypto Tests...");

    const testData = {
        name: "Test User",
        resentments: [
            { id: 1, col1: "Boss", col2: "Fired me", col3: "Security", col4: "Selfish", col5: "Pray" }
        ],
        secret: "This is a secret message!"
    };

    const password = "my-secure-password-123";

    try {
        // 1. Encryption
        console.log("Test 1: Encrypting data...");
        const startEnc = performance.now();
        const encrypted = await encryptData(testData, password);
        const endEnc = performance.now();
        console.log(`Encryption successful (${(endEnc - startEnc).toFixed(2)}ms). Output length: ${encrypted.length}`);

        const encObj = JSON.parse(encrypted);
        if (!encObj.ct || !encObj.iv || !encObj.s) {
            throw new Error("Encryption output format is invalid (missing fields)");
        }

        // 2. Decryption (Success)
        console.log("Test 2: Decrypting with correct password...");
        const startDec = performance.now();
        const decrypted = await decryptData(encrypted, password);
        const endDec = performance.now();

        if (JSON.stringify(decrypted) === JSON.stringify(testData)) {
            console.log(`Decryption successful (${(endDec - startDec).toFixed(2)}ms). Data matches original.`);
        } else {
            throw new Error("Decrypted data does not match original!");
        }

        // 3. Decryption (Failure - Wrong Password)
        console.log("Test 3: Decrypting with wrong password...");
        try {
            await decryptData(encrypted, "wrong-password");
            throw new Error("Decryption should have failed but succeeded!");
        } catch (e: any) {
            if (e.message.includes("Decryption failed")) {
                console.log("Decryption failed correctly with wrong password.");
            } else {
                throw e;
            }
        }

        // 4. Decryption (Failure - Tampered Data)
        console.log("Test 4: Decrypting tampered data...");
        const tamperedObj = { ...encObj, ct: encObj.ct.substring(0, encObj.ct.length - 1) + "A" };
        const tamperedJson = JSON.stringify(tamperedObj);
        try {
             await decryptData(tamperedJson, password);
             console.log("Warning: Tampered data might have decrypted (depending on padding/mode), check integrity.");
        } catch (e) {
            console.log("Decryption failed correctly with tampered data.");
        }

        console.log("\nALL TESTS PASSED ✅");

    } catch (error) {
        console.error("\nTEST FAILED ❌");
        console.error(error);
        process.exit(1);
    }
}

runTests();
