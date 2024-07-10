import { Body, Controller, Get, Post, Req, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Req() req: any) {
    // return {user: req.user};
    return this.authService.login(req.user);
  }

//   @UseGuards(AuthGuard('jwt-custom'))
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }
}
