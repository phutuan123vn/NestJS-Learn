// jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class AccessJwtStrategy extends PassportStrategy(
  Strategy,
  'access-jwt',
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('ACCESS_JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    // Validate and return a user object for access token
    const user = { userId: payload.sub, username: payload.username };
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'refresh-jwt',
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          let token = null
          if (req && req.cookies) {
            token = req.cookies['refreshtoken']
          }
          return token
        }
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('REFRESH_JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    // Validate and return a user object for refresh token
    const user = { userId: payload.sub, username: payload.username };
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
