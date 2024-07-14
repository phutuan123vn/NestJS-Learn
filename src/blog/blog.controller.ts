import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { BlogService } from './blog.service';
import { Request } from '@/types';
import { CreateBlogDTO } from './dto';
import { Public } from '@/auth';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post('create')
  async createBlog(@Req() req: Request, @Body() createBlogDTO: CreateBlogDTO) {
    console.log(req.user);
    return await this.blogService.createBlog(createBlogDTO, req.user);
  }

  // @Public()
  @Post('')
  async getBlogs() {
    const result = await this.blogService.getBlogs();
    return { data: result };
  }

  @Public()
  @Get(':slug')
  async getBlogBySlug(@Param('slug') slug: string) {
    const blog = await this.blogService.getBlogBySlug(slug);
    if (!blog) {
      throw new Error('Blog not found');
    }
    return { data: blog };
    // return slug;
  }

  @Post(':slug/comment')
  async createComment(
    @Param('slug') slug: string,
    @Body() comment: { content: string },
    @Req() req: Request,
  ) {
    const user = req.user;
    this.blogService
      .createComment(slug, comment.content, user)
      .then(() => {
        return { message: 'Comment created' };
      })
      .catch((err) => {
        return { error: err, message: 'Error creating comment' };
      });
  }
}
