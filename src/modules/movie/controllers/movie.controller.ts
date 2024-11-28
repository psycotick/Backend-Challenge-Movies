import {
  Controller,
  Get,
  Param,
  Query,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { MovieService } from "../services/movie.service";
import { FilterMoviesDto } from "../dto/filter-movies.dto";

@Controller("movie")
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get("popular")
  async getPopularMovies(): Promise<any> {
    return this.movieService.getPopularMovies();
  }

  @Get("filter")
  @UsePipes(new ValidationPipe({ transform: true }))
  async filterMovies(@Query() filterMoviesDto: FilterMoviesDto): Promise<any> {
    return this.movieService.filterMovies(filterMoviesDto);
  }

  @Get(":id")
  async getMovie(@Param("id") id: number): Promise<any> {
    return this.movieService.getMovieDetails(Number(id));
  }
}
