import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ConflictException,
} from '@nestjs/common';
import { Request } from 'express';

interface CachedResponse {
  statusCode: number;
  data: any;
  timestamp: number;
}

@Injectable()
export class IdempotencyGuard implements CanActivate {
  private static readonly memoryStore = new Map<string, CachedResponse>();
  private static readonly TTL_MS = 24 * 60 * 60 * 1000; // 24 hours retention

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const idempotencyKey =
      (request.headers['idempotency-key'] as string) ||
      (request.headers['x-idempotency-key'] as string);

    // Only enforce if the client supplies an Idempotency-Key header or is a critical POST/PATCH
    if (!idempotencyKey) {
      return true;
    }

    const key = `idem:${idempotencyKey}`;
    const now = Date.now();
    const existing = IdempotencyGuard.memoryStore.get(key);

    if (existing) {
      if (now - existing.timestamp < IdempotencyGuard.TTL_MS) {
        throw new ConflictException({
          statusCode: 409,
          error: 'Conflict',
          message: 'A request with this Idempotency-Key is already completed or processing. Duplicate request prevented.',
          idempotencyKey,
        });
      } else {
        IdempotencyGuard.memoryStore.delete(key);
      }
    }

    // Register active execution
    IdempotencyGuard.memoryStore.set(key, {
      statusCode: 200,
      data: null,
      timestamp: now,
    });

    return true;
  }
}
