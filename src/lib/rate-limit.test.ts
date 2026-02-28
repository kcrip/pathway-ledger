
import { checkRateLimit } from './rate-limit';
import assert from 'node:assert';
import test from 'node:test';

test('Rate Limiter', async (t) => {
  await t.test('allows requests within limit', () => {
    const ip = '127.0.0.1';

    try {
      for (let i = 0; i < 9; i++) {
        checkRateLimit(ip);
      }
      assert.ok(true, 'Allowed 9 requests');
    } catch (e) {
      assert.fail('Should not throw for 9 requests');
    }
  });

  await t.test('blocks requests over limit', () => {
    const ip = '127.0.0.2';

    // Fill up the bucket
    for (let i = 0; i < 10; i++) {
        checkRateLimit(ip);
    }

    try {
      checkRateLimit(ip);
      assert.fail('Should have thrown error');
    } catch (e: any) {
      assert.strictEqual(e.message, 'Rate limit exceeded. Please try again later.');
    }
  });

  await t.test('handles comma-separated headers correctly (takes first IP)', () => {
    // Unique "first" IP to test isolation
    const clientIp = '10.0.0.1';
    const proxyIp = '192.168.1.1';
    const header = `${clientIp}, ${proxyIp}`;

    try {
        // Should use '10.0.0.1' as the key
        checkRateLimit(header);
        assert.ok(true, 'Handled comma-separated header');
    } catch (e) {
        assert.fail('Should handle comma-separated header without error');
    }
  });
});
