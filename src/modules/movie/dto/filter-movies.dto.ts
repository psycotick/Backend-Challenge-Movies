import { IsOptional, IsString } from "class-validator";

export class FilterMoviesDto {
  @IsOptional()
  @IsString()
  genre?: string;

  @IsOptional()
  @IsString()
  popularity?: string;

  @IsOptional()
  @IsString()
  title?: string;
}
