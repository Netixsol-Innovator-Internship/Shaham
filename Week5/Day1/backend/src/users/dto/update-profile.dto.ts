import { IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional() @IsString() @Length(1, 60) username?: string;
  @IsOptional() @IsString() @Length(0, 280) bio?: string;
  @IsOptional() @IsString() @IsUrl({ require_tld: false }) avatarUrl?: string;
}
