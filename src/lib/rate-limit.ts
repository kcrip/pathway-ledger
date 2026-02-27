/**
 * Simple in-memory rate limiter.
 * Note: In a distributed environment (like Vercel serverless functions),
 * this state is not shared across instances. However, it still provides
 * a layer of protection against rapid-fire abuse on a single instance.
 * For production with high traffic, use a dedicated store like Redis (e.g., Upstash).
 *
 * This implementation is chosen because the application is local-first
 * and has no backend database or authentication system to check user sessions against.
 */

const WINDOW_SIZE = 60 * 1000; // 1 minute
const MAX_REQUESTS = 10; // 10 requests per minute

// Map to store request timestamps for each IP
// Key: IP address, Value: Array of timestamps
const rateLimitMap = new Map<string, number[]>();

export function checkRateLimit(ipHeader: string | null) {
  // Handle x-forwarded-for which can be comma-separated list of IPs
  // We want the first one (client IP)
  const ip = ipHeader ? ipHeader.split(',')[0].trim() : 'unknown';

  const now = Date.now();
  const windowStart = now - WINDOW_SIZE;

  const timestamps = rateLimitMap.get(ip) || [];

  // Filter requests outside the window
  const recentTimestamps = timestamps.filter(timestamp => timestamp > windowStart);

  if (recentTimestamps.length >= MAX_REQUESTS) {
    throw new Error('Rate limit exceeded. Please try again later.');
  }

  recentTimestamps.push(now);
  rateLimitMap.set(ip, recentTimestamps);

  // Simple cleanup to prevent memory leak if map grows too large
  if (rateLimitMap.size > 1000) {
     for (const [key, times] of rateLimitMap.entries()) {
       const valid = times.filter(t => t > windowStart);
       if (valid.length === 0) {
         rateLimitMap.delete(key);
       } else {
         rateLimitMap.set(key, valid);
       }
     }
  }
}
