import { IsEmail, IsString, MinLength, Length } from 'class-validator';

export class RegisterDto {
  @IsString() @Length(3, 30) username: string;
  @IsEmail() email: string;
  @IsString() @MinLength(6) password: string;
}
