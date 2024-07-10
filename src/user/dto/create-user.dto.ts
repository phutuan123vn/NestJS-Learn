import { IsEmail, IsNotEmpty } from "class-validator";
import { Transform } from 'class-transformer';
export function BigIntToString() {
  return Transform(({ value }) =>
    typeof value === 'bigint' ? value.toString() : value,
  );
}

export class CreateUserDto {

    @IsEmail()
    @IsNotEmpty()
    email: string;
    
    @IsNotEmpty()
    password: string;
    
    name?: string;

    constructor(partial: Partial<CreateUserDto>) {
        Object.assign(this, partial);
    }
}