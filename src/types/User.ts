import { User as BaseUser } from '@prisma/client';
export type UserFromToken = {
    userId: number;
    email: string;
    type: string;
}

export type User = BaseUser & UserFromToken;