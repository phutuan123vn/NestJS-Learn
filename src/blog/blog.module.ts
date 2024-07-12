import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { PrismaService } from '@/prisma.service';

@Module({
  imports: [],
  providers: [BlogService, PrismaService],
  controllers: [BlogController]
})
export class BlogModule {}
