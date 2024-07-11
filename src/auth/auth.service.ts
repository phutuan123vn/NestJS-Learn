import { UserService } from '@/user/user.service';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ModuleRef } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService implements OnModuleInit{
  private userService: UserService;
  constructor(
    private moduleRef: ModuleRef,
    private jwtService: JwtService,
    readonly configService: ConfigService,
  ) {}

  onModuleInit() {
    this.userService = this.moduleRef.get(UserService, { strict: false });
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findUser(email, {
      id: true,
      email: true,
      password: true,
    });
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { userId: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async createToken(user: User | any) {
    const payload = { userID: user.id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync({
        ...payload,
        type: 'access',
      }),
      refresh_token: await this.jwtService.signAsync(
        { ...payload, type: 'refresh' },
        {
          expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION'),
          secret: this.configService.get<string>('JWT_REFRESH_KEY'),
        },
      ),
    };
  }
}
