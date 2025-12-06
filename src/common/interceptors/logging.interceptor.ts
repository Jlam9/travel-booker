import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Logger,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();

    const req = context.switchToHttp().getRequest();
    const { method, url } = req;

    const userId = req.user?.id ?? null;

    return next.handle().pipe(
      tap(() => {
        const res = context.switchToHttp().getResponse();
        const statusCode = res.statusCode;

        const log = {
          timestamp: new Date().toISOString(),
          method,
          url,
          statusCode,
          responseTimeMs: Date.now() - now,
          userId,
        };

        this.logger.log(JSON.stringify(log));
      }),
    );
  }
}
