import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaService } from '@/prisma.service';

@Module({
    imports: [],
    controllers: [],
    providers: [UserService, PrismaService],
    exports: [UserService],
})
export class UserModule {}
