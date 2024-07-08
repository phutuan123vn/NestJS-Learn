import { AccountService } from '@/account/account.service';
import { BaseAccountDto } from '@/account/dto';
import { Body, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private accountService: AccountService,
    private jwtService: JwtService,
  ) {}

  async signIn(@Body() baseAccountDto: BaseAccountDto): Promise<{
    access_token: string;
  }> {
    const user = await this.accountService.findOne(baseAccountDto.email);
    if (!user || user?.password !== baseAccountDto.password) {
      console.log('use is null', user);
      throw new UnauthorizedException();
    }
    const payload = { sub: user.userId, username: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
    // return null;
  }


  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.accountService.findOne(email);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
