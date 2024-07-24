import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthInterceptor, AuthModule, AuthService, JwtAuthGuard } from '@/auth';
import { BlogModule } from './blog/blog.module';
import { EventsModule } from './Events/events.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: true,
    }),
    EventsModule,
    UserModule,
    AuthModule,
    BlogModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      // imports: [AuthModule],
      provide: APP_INTERCEPTOR,
      useFactory(authService: AuthService, configService: ConfigService) {
        return new AuthInterceptor(authService, configService);
      },
      inject: [AuthService, ConfigService],
      // useClass: AuthInterceptor,
    },
  ],
})
export class AppModule {}
