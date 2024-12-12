import { IsOptional, IsString } from "class-validator";

/**
 * Dto de Logíca para las películas.
 * @author Santiago Ruiz - santiago.develops@gmail.com
 * @copyright Psycotick Software S.L.
 * @license MIT
 */

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
