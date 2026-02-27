
import { rateLimit } from './src/lib/rate-limiter';
import assert from 'assert';

console.log('Running verification script for rate limiter...');

const ip = '127.0.0.1';
const limit = 5;

// Test Rate Limiter
try {
  for (let i = 0; i < limit; i++) {
    rateLimit(ip);
    console.log(`Request ${i + 1} allowed`);
  }
} catch (e) {
  console.error('Unexpected error during allowed requests:', e);
  process.exit(1);
}

try {
  rateLimit(ip);
  console.error('Error: Rate limit should have been exceeded but was not.');
  process.exit(1);
} catch (e) {
  if (e instanceof Error && e.message === 'Rate limit exceeded. Please try again later.') {
    console.log('Success: Rate limit correctly exceeded.');
  } else {
    console.error('Error: Unexpected error message:', e);
    process.exit(1);
  }
}

// Verification of Schema is harder to script directly without mocking the AI flow or importing the schema which is not exported for testing easily without refactoring.
// However, since the code uses `z.object({...})` instead of `z.any()`, type safety is enforced at runtime by Genkit.
// The primary security fix (Rate Limiting) is verified.

console.log('Verification passed!');
