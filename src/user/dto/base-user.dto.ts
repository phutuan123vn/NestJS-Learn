import { OmitType, PartialType } from "@nestjs/mapped-types";
import { BigIntToString, CreateUserDto } from "./create-user.dto";
import { User as UserModel } from "@prisma/client";
export class BaseUserDto {
    @BigIntToString()
    id: number;
    email:string;
    name?: string;

    constructor(partial: Partial<BaseUserDto>) {
        Object.assign(this, partial);
    }
}