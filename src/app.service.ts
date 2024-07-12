import { Injectable } from '@nestjs/common';
import { Blog } from '@prisma/client';
import { keys } from 'ts-transformer-keys';

interface Props {
  id: string;
  name: string;
  age: number;
}

@Injectable()
export class AppService {
  getHello(): string {
    const keysProps = keys<Props>();
    console.log(keysProps);
    return 'Hello World!';
  }
}
