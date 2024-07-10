import { PrismaService } from '@/prisma.service';
import { Injectable } from '@nestjs/common';
import { User as UserModel } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findUser(
    key: string | number,
    select?: {[Key in keyof UserModel]?: boolean},
  ): Promise<Partial<UserModel>> {
    const param = typeof key === 'string' ? { email: key } : { id: key };
    return this.prisma.user.findUnique({
      where: param,
      select,
    });
  }
}
