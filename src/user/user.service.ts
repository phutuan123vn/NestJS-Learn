import { AuthService } from '@/auth';
import { PrismaService } from '@/prisma.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User as UserModel } from '@prisma/client';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(
    private authService: AuthService,
    private readonly prisma: PrismaService,
    readonly configService: ConfigService,
  ) {}



  async findUser(
    key: string | number,
    select?: { [Key in keyof UserModel]?: boolean },
  ): Promise<Partial<UserModel>> {
    const param = typeof key === 'string' ? { email: key } : { id: key };
    return this.prisma.user.findUnique({
      where: param,
      select,
    });
  }

  async createToken(user: UserModel | any) {
    return this.authService.createToken(user);
  }

  async createUser(data: Partial<UserModel>) {
    const user = await this.findUser(data.email);
    if (user) {
      throw new Error('User already exists');
    }
    data.password = await bcrypt.hash(data.password, 10)
    return this.prisma.user.create({
      data: data as UserModel,
    });
  }
}
