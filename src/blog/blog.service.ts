import { PrismaService } from '@/prisma.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateBlogDTO } from './dto';
import { Blog, User } from '@prisma/client';
import { keys as getKeys } from 'ts-transformer-keys';

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
    blogSelect: { [Key in keyof Blog]?: boolean } | Array<keyof Blog> = Object.fromEntries(getKeys<Blog>().map((key) => [key, true])),
    authorSelect: { [Key in keyof User]?: boolean } | Array<keyof User> = ['id', 'email'],
  ) {
    const blog = Array.isArray(blogSelect) ? Object.fromEntries(blogSelect.map((key) => [key, true])) : blogSelect;
    const author = Array.isArray(authorSelect) ? Object.fromEntries(authorSelect.map((key) => [key, true])) : authorSelect;
    return this.prisma.blog.findMany({
      // select: {},
      // select: blogSelect,
      select: {
        ...blog,
        author: {
          select: author,
        },
      },
    });
  }
}
