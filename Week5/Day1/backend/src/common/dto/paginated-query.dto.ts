import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class PaginatedQueryDto {
  @IsOptional() @IsInt() @Min(0) skip?: number = 0;
  @IsOptional() @IsInt() @Min(1) limit?: number = 20;
  @IsOptional() @IsString() search?: string;
}
