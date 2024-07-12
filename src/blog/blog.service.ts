import { PrismaService } from '@/prisma.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateBlogDTO } from './dto';
import { Blog, User } from '@prisma/client';

@Injectable()
export class BlogService {
  constructor(
    private readonly prisma: PrismaService,
    readonly configService: ConfigService,
  ) {}

  async createBlog(data: CreateBlogDTO, user: User | any) {
    return this.prisma.blog.create({
      data: {
        ...data,
        authorId: user.userId,
      } as Blog,
    });
  }

  async getBlogs(
    blogSelect: { [Key in keyof Blog]: boolean } = Object.fromEntries(
      (Object.keys({} as Blog)).map((key) => [key, true]),
    ) as { [K in keyof Blog]: boolean },
    authorSelect?: { [Key in keyof User]?: boolean },
  ) {
    console.log(blogSelect);
    return this.prisma.blog.findMany({
      // select: {},
      // select: blogSelect,
      select: {
        ...blogSelect,
        author: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
  }
}
