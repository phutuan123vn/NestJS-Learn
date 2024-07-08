import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { BaseAccountDto, CreateAccountDto } from '@/account/dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() baseAccountDto: CreateAccountDto) {
    console.log('baseAccountDto', baseAccountDto);
    return this.authService.signIn(baseAccountDto);
  }


  @UseGuards(AuthGuard)
  @Get('me')
  getMe(@Req() req){
    console.log('req', req);
    return req.user;
  }
}
