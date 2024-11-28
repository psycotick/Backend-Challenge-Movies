import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
import { lastValueFrom } from "rxjs";
import { map } from "rxjs/operators";
import { FilterMoviesDto } from "../dto/filter-movies.dto";
import { AxiosError } from "axios";

@Injectable()
export class MovieService {
  private readonly apiKey: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.apiKey = this.configService.get<string>("API_KEY_MOVIES") ?? "";
    if (!this.apiKey) {
      throw new Error(
        "API_KEY_MOVIES is not defined in the environment variables",
      );
    }
  }

  async getMovieDetails(movieId: number): Promise<any> {
    const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${this.apiKey}`;
    const response$ = this.httpService
      .get(url)
      .pipe(map((response) => response.data));

    const data = await lastValueFrom(response$);
    if (!data) {
      throw new Error("No se pudo obtener los detalles de la película");
    }

    return data;
  }

  async getPopularMovies(): Promise<any> {
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${this.apiKey}`;
    const response$ = this.httpService
      .get(url)
      .pipe(map((response) => response.data));

    return await lastValueFrom(response$);
  }

  async filterMovies(filterMoviesDto: FilterMoviesDto): Promise<any> {
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${this.apiKey}`;
    const params = new URLSearchParams();

    if (filterMoviesDto.genre) {
      params.append("with_genres", filterMoviesDto.genre);
    }
    if (filterMoviesDto.popularity) {
      params.append("sort_by", "popularity.desc");
    }
    if (filterMoviesDto.title) {
      params.append("query", filterMoviesDto.title);
    }

    console.log(`Request URL: ${url}&${params.toString()}`);

    const response$ = this.httpService
      .get(`${url}&${params.toString()}`)
      .pipe(map((response) => response.data));

    try {
      const data = await lastValueFrom(response$);
      if (!data) {
        throw new HttpException(
          "No se pudieron obtener los detalles de las películas",
          HttpStatus.NOT_FOUND,
        );
      }

      return data;
    } catch (err) {
      const axiosError = err as AxiosError;
      if (axiosError.response) {
        console.error(
          `Request failed with status code ${axiosError.response.status}`,
          axiosError.response.data,
        );
        throw new HttpException(
          `Request failed: ${axiosError.response.status}`,
          axiosError.response.status,
        );
      } else {
        console.error(`Error: ${axiosError.message}`);
        throw new HttpException(
          `Request failed: ${axiosError.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
