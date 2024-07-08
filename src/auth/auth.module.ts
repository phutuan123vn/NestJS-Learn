import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccountModule } from 'src/account/account.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    // AccountModule
    AccountModule,
    JwtModule.registerAsync({
      global: true,
      useFactory: () => ({
        secret: 'hard!to-guess_secret',
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
