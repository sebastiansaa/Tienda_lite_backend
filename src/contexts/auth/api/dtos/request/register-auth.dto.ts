import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterAuthDto {
    @IsEmail()
    readonly email: string;

    @IsString()
    @MinLength(8)
    readonly password: string;
}
