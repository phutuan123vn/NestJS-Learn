import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { map, Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  constructor(
    private readonly authService: AuthService,
    readonly configService: ConfigService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    return next.handle().pipe(map(async (data) => {
      if (request?.authType === 'refresh') {
        const user = request.user;
        const {access_token} = await this.authService.createToken(user);
        // return {data, access_token};
        data['access_token'] = access_token;
      }
      return data;
    }));
  }
}
