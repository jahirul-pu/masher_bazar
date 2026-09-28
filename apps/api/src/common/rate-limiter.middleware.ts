import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

interface RateLimitBucket {
  count: number;
  resetTime: number;
}

@Injectable()
export class RateLimiterMiddleware implements NestMiddleware {
  private readonly buckets = new Map<string, RateLimitBucket>();
  private readonly WINDOW_MS = 60 * 1000; // 1 minute window
  private readonly MAX_REQUESTS_DEFAULT = 120; // 120 req/min for general API
  private readonly MAX_REQUESTS_AUTH = 10; // 10 req/min for OTP / auth endpoints

  use(req: Request, res: Response, next: NextFunction) {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const isAuthRoute = req.originalUrl.includes('/auth/otp') || req.originalUrl.includes('/payments/execute');
    const limit = isAuthRoute ? this.MAX_REQUESTS_AUTH : this.MAX_REQUESTS_DEFAULT;

    const key = `${ip}:${isAuthRoute ? 'auth' : 'api'}`;
    const now = Date.now();

    const bucket = this.buckets.get(key) || { count: 0, resetTime: now + this.WINDOW_MS };

    if (now > bucket.resetTime) {
      bucket.count = 1;
      bucket.resetTime = now + this.WINDOW_MS;
    } else {
      bucket.count += 1;
    }

    this.buckets.set(key, bucket);

    res.setHeader('X-RateLimit-Limit', limit.toString());
    res.setHeader('X-RateLimit-Remaining', Math.max(0, limit - bucket.count).toString());
    res.setHeader('X-RateLimit-Reset', Math.ceil(bucket.resetTime / 1000).toString());

    if (bucket.count > limit) {
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: 'Too many requests. Please wait a moment before trying again.',
          retryAfterSeconds: Math.ceil((bucket.resetTime - now) / 1000),
        },
        HttpStatus.TOO_MANY_REQUESTS
      );
    }

    next();
  }
}
