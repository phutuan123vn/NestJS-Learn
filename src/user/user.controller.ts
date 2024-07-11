import { LocalAuthGuard, Public } from '@/auth';
import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { Request } from '@/types';
import { Response } from 'express';
import { CreateUserDto } from './dto';


@Public()
@Controller('account')
export class UserController {
  constructor(
    private readonly userService: UserService,
    readonly configService: ConfigService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: Request, @Res() res: Response) {
    const { access_token, refresh_token } = await this.userService.createToken(
      req.user,
    );
    res.cookie('refreshtoken', refresh_token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    return res.json({ access_token });
  }

  @Post('register')
  async register(@Req() req: Request, @Res() res: Response, @Body() createUserDTO: CreateUserDto) {
    let user
    try {
      user = await this.userService.createUser(createUserDTO);
    }catch (error) {
      return res.status(400).json({ message: error.message });
    }
    return res.json(user);
  }
}
