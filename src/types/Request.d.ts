import { Request } from 'express';
import { User } from './User';

export type Request = Request & {
  authType: string | undefined;
  user: User | undefined;
};
