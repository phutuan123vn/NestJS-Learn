import { Body, Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto';
import { UpdateAccountDto } from './dto';
import { BaseAccountDto } from './dto';

@Injectable()
export class AccountService {
  create(@Body() createAccountDto: CreateAccountDto) {
    return 'This action adds a new account';
  }

  findAll() {
    return `This action returns all account`;
  }

  findOne(id: number) {
    return `This action returns a #${id} account`;
  }

  update(id: number, updateAccountDto: UpdateAccountDto) {
    return `This action updates a #${id} account`;
  }

  remove(id: number) {
    return `This action removes a #${id} account`;
  }

  signIn(email: string, password: string){
    return `This action signs in a ${email} account`;
  }
}
