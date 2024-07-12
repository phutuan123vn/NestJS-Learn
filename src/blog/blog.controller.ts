import { Body, Controller, Get, Post, Req } from '@nestjs/common';
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

  @Public()
  @Get('')
  async getBlogs() {
    return await this.blogService.getBlogs();
  }
}
