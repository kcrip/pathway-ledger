
const rateLimitMap = new Map<string, { count: number; lastReset: number; timeoutId: NodeJS.Timeout }>();

export interface RateLimitConfig {
  interval: number; // Window size in milliseconds
  limit: number;    // Max requests per window
}

/**
 * A simple in-memory rate limiter.
 * Note: This is per-instance. In a serverless environment like Vercel, state is not shared between lambdas.
 * However, this provides basic protection against single-instance abuse and simple DoS attacks.
 * For robust distributed rate limiting, consider using Redis (e.g., Upstash) or a database.
 */
export function rateLimit(ip: string, config: RateLimitConfig = { interval: 60000, limit: 5 }) {
  const now = Date.now();
  let record = rateLimitMap.get(ip);

  if (!record) {
    // New record for this IP
    const timeoutId = setTimeout(() => {
      rateLimitMap.delete(ip);
    }, config.interval);

    record = { count: 1, lastReset: now, timeoutId };
    rateLimitMap.set(ip, record);
  } else {
    // Existing record
    if (now - record.lastReset > config.interval) {
      // Reset window if it somehow wasn't cleaned up (defensive coding)
      clearTimeout(record.timeoutId);
      const timeoutId = setTimeout(() => {
        rateLimitMap.delete(ip);
      }, config.interval);

      record.count = 1;
      record.lastReset = now;
      record.timeoutId = timeoutId;
    } else {
      record.count++;
    }
    rateLimitMap.set(ip, record);
  }

  if (record.count > config.limit) {
    throw new Error('Rate limit exceeded. Please try again later.');
  }
}
