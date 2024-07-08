import { Body, Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto';
import { UpdateAccountDto } from './dto';
import { BaseAccountDto } from './dto';

interface User {
  userId: number;
  email: string;
  password: string;
}

@Injectable()
export class AccountService {
  private readonly users: User[] = [
    {
      userId: 1,
      email: 'ptt@gmail.com',
      password: 'changeme',
    },
    {
      userId: 2,
      email: 'ptt1@gmail.com',
      password: 'guess',
    },
  ];

  async findOne(email: string): Promise<User | undefined> {
    return this.users.find((user) => user.email === email);
  }
}
