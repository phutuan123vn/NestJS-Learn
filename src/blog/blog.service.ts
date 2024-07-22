import { PrismaService } from '@/prisma.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateBlogDTO } from './dto';
import { Blog } from '@prisma/client';
import { keys as getKeys } from 'ts-transformer-keys';
import { User } from '@/types';

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
    blogSelect:
      | { [Key in keyof Blog]?: boolean }
      | Array<keyof Blog> = Object.fromEntries(
      getKeys<Blog>().map((key) => [key, true]),
    ),
    authorSelect: { [Key in keyof User]?: boolean } | Array<keyof User> = [
      'id',
      'email',
    ],
  ) {
    const blog = Array.isArray(blogSelect)
      ? Object.fromEntries(blogSelect.map((key) => [key, true]))
      : blogSelect;
    const author = Array.isArray(authorSelect)
      ? Object.fromEntries(authorSelect.map((key) => [key, true]))
      : authorSelect;
    return this.prisma.$transaction([
      this.prisma.blog.findMany({
        select: {
          ...blog,
          author: {
            select: author,
          },
        },
      }),
      this.prisma.blog.count(),
    ]);
  }

  async getBlogBySlug(slug: string) {
    return this.prisma.blog.findUnique({
      where: {
        slug,
      },
      include: {
        comments: {
          select: {
            content: true,
            user: {
              select: {
                email: true,
              },
            },
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          }
        },
      }
    });
  }

  async createComment(slug: string, content: string, user: User) {
    return this.prisma.blogComment.create({
      data: {
        content,
        blog: {
          connect: {
            slug,
          },
        },
        user: {
          connect: {
            id: user.userId,
          },
        },
      },
    });
  }
}
