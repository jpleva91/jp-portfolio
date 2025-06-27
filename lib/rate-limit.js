import { LRUCache } from 'lru-cache';

export default function rateLimit(options = {}) {
  const tokenCache = new LRUCache({
    max: options.uniqueTokenPerInterval || 500,
    ttl: options.interval || 60000, // 1 minute default
  });

  return {
    check: async (res, limit, token) => {
      const tokenCount = tokenCache.get(token) || 0;
      
      if (tokenCount >= limit) {
        return {
          success: false,
          limit,
          remaining: 0,
          reset: Date.now() + (options.interval || 60000)
        };
      }

      tokenCache.set(token, tokenCount + 1);
      
      const remaining = limit - tokenCount - 1;
      const reset = Date.now() + (options.interval || 60000);

      // Set rate limit headers
      res.setHeader('X-RateLimit-Limit', limit);
      res.setHeader('X-RateLimit-Remaining', remaining);
      res.setHeader('X-RateLimit-Reset', new Date(reset).toISOString());

      return {
        success: true,
        limit,
        remaining,
        reset
      };
    },
  };
}