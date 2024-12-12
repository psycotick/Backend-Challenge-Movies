import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
import { lastValueFrom } from "rxjs";
import { map } from "rxjs/operators";
import { FilterMoviesDto } from "../dto/filter-movies.dto";
import { AxiosError } from "axios";

/**
 * Servicio de Logíca de las películas
 * @author Santiago Ruiz - santiago.develops@gmail.com
 * @copyright Psycotick Software S.L.
 * @license MIT
 */

@Injectable()
export class MovieService {
  private readonly apiKey: string;
  private readonly logger = new Logger(MovieService.name);

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

  /**
   * Obtiene las películas populares.
   * @returns {Promise<any>}
   * @throws {HttpException}
   */
  async getPopularMoviesService(): Promise<any> {
    this.logger.debug("Ejecutando getPopularMovies");
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${this.apiKey}&language=en-US&page=1`;
    try {
      const response$ = this.httpService
        .get(url)
        .pipe(map((response) => response.data));

      const data = await lastValueFrom(response$);
      if (!data) {
        throw new Error("No se pudo obtener las películas populares");
      }

      return data;
    } catch (error) {
      this.logger.error("Error in getPopularMovies");
      throw new HttpException(
        "No se pudieron obtener las películas populares",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Filtra películas según criterios específicos.
   * @param {FilterMoviesDto} filterMoviesDto
   * @returns {Promise<any>}
   * @throws {HttpException}
   */
  async getFilterMoviesService(filterMoviesDto: FilterMoviesDto): Promise<any> {
    this.logger.debug("Ejecutando filterMovies");
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

    const requestUrl = `${url}&${params.toString()}`;
    this.logger.debug(`Request URL: ${requestUrl}`);

    try {
      const response$ = this.httpService
        .get(requestUrl)
        .pipe(map((response) => response.data));

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
        this.logger.error(
          `Request failed with status code ${axiosError.response.status}`,
          axiosError.response.data,
        );
        throw new HttpException(
          `Request failed: ${axiosError.response.status}`,
          axiosError.response.status,
        );
      } else {
        this.logger.error(`Error: ${axiosError.message}`);
        throw new HttpException(
          `Request failed: ${axiosError.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  /**
   * Obtiene las películas en cartelera.
   * @returns {Promise<any>}
   * @throws {HttpException}
   */
  async getNowPlayingMoviesService(): Promise<any> {
    this.logger.debug("Ejecutando getNowPlayingMovies");
    const url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${this.apiKey}&language=en-US&page=1`;
    try {
      const response$ = this.httpService
        .get(url)
        .pipe(map((response) => response.data));

      const data = await lastValueFrom(response$);
      if (!data) {
        throw new Error("No se pudo obtener las películas en cartelera");
      }

      return data;
    } catch (error) {
      this.logger.error("Error in getNowPlayingMovies");
      throw new HttpException(
        "No se pudo obtener las películas en cartelera",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Obtiene las películas próximas a estrenarse.
   * @returns {Promise<any>}
   * @throws {HttpException}
   */
  async getUpcomingMoviesService(): Promise<any> {
    this.logger.debug("Ejecutando getUpcomingMovies");
    const url = `https://api.themoviedb.org/3/movie/upcoming?api_key=${this.apiKey}&language=en-US&page=1`;
    try {
      const response$ = this.httpService
        .get(url)
        .pipe(map((response) => response.data));

      const data = await lastValueFrom(response$);
      if (!data) {
        throw new Error(
          "No se pudo obtener las películas próximas a estrenarse",
        );
      }

      return data;
    } catch (error) {
      this.logger.error("Error in getUpcomingMovies");
      throw new HttpException(
        "No se pudo obtener las películas próximas a estrenarse",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Obtiene las películas mejor valoradas.
   * @returns {Promise<any>}
   * @throws {HttpException}
   */
  async getTopRatedMoviesService(): Promise<any> {
    this.logger.debug("Ejecutando getTopRatedMovies");
    const url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${this.apiKey}&language=en-US&page=1`;
    try {
      const response$ = this.httpService
        .get(url)
        .pipe(map((response) => response.data));

      const data = await lastValueFrom(response$);
      if (!data) {
        throw new Error("No se pudo obtener las películas mejor valoradas");
      }

      return data;
    } catch (error) {
      this.logger.error("Error in getTopRatedMovies");
      throw new HttpException(
        "No se pudieron obtener las películas mejor valoradas",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Descubre películas basadas en un género o palabras clave.
   * @param {string} id
   * @param {string} keywords
   * @returns {Promise<any>}
   * @throws {HttpException}
   */
  async getDiscoverMoviesService(id?: string, keywords?: string): Promise<any> {
    this.logger.debug(
      `Ejecutando getDiscoverMovies con id: ${id} and keywords: ${keywords}`,
    );
    const url = new URL(
      `https://api.themoviedb.org/3/discover/movie?api_key=${this.apiKey}&language=en-US&page=1`,
    );

    if (keywords) {
      url.searchParams.set("with_keywords", keywords);
    }
    if (id) {
      url.searchParams.set("with_genres", id);
    }

    try {
      const response$ = this.httpService
        .get(url.toString())
        .pipe(map((response) => response.data));

      const data = await lastValueFrom(response$);
      if (!data) {
        throw new Error("No se pudo obtener las películas");
      }

      return data;
    } catch (error) {
      this.logger.error("Error in getDiscoverMovies");
      throw new HttpException(
        "No se pudieron obtener las películas",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Busca películas por término.
   * @param {string} term
   * @returns {Promise<any>}
   * @throws {HttpException}
   */
  async getSearchedMoviesService(term: string): Promise<any> {
    this.logger.debug(`Ejecutando getSearchedMovies para el término: ${term}`);
    const url = new URL(
      `https://api.themoviedb.org/3/search/movie?api_key=${this.apiKey}&language=en-US&page=1`,
    );
    url.searchParams.set("query", term);

    try {
      const response$ = this.httpService
        .get(url.toString())
        .pipe(map((response) => response.data));

      const data = await lastValueFrom(response$);
      if (!data) {
        throw new Error("No se pudo obtener las películas buscadas");
      }

      return data;
    } catch (error) {
      this.logger.error("Error in getSearchedMovies");
      throw new HttpException(
        "No se pudieron obtener las películas buscadas",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Obtiene los géneros de las películas.
   * @returns {Promise<any>}
   * @throws {HttpException}
   */
  async getMovieGenresService(): Promise<any> {
    this.logger.debug("Ejecutando getMovieGenres");
    const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${this.apiKey}&language=en-US`;

    try {
      const response$ = this.httpService
        .get(url)
        .pipe(map((response) => response.data.genres));

      const data = await lastValueFrom(response$);
      if (!data) {
        throw new Error("No se pudieron obtener los géneros de las películas");
      }

      return data;
    } catch (error) {
      this.logger.error("Error in getMovieGenres");
      throw new HttpException(
        "No se pudieron obtener los géneros de las películas",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Obtiene una lista de películas basadas en el ID del género.
   * @param {string} genreId
   * @returns {Promise<any>}
   * @throws {HttpException}
   */
  async getListMoviesService(genreId: string): Promise<any> {
    this.logger.debug(`Ejecutando getListMovies para genreId: ${genreId}`);
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${this.apiKey}&with_genres=${genreId}`;
    try {
      const response$ = this.httpService
        .get(url)
        .pipe(map((response) => response.data));

      const data = await lastValueFrom(response$);
      if (!data) {
        throw new Error("No se pudo obtener las películas del género");
      }
      return data;
    } catch (error) {
      this.logger.error("Error in getListMovies");
      throw new HttpException(
        "No se pudo obtener las películas del género",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Obtiene los videos de una película específica.
   * @param {string} id
   * @returns {Promise<any>}
   * @throws {HttpException}
   */
  async getMovieVideosService(id: string): Promise<any> {
    this.logger.debug(`Ejecutando getMovieVideos for movieId: ${id}`);
    const url = new URL(
      `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${this.apiKey}`,
    );

    try {
      const response$ = this.httpService
        .get(url.toString())
        .pipe(map((response) => response.data));

      const data = await lastValueFrom(response$);
      if (!data) {
        throw new Error("No se pudieron obtener los videos de la película");
      }

      return data;
    } catch (error) {
      this.logger.error("Error in getMovieVideos");
      throw new HttpException(
        "No se pudieron obtener los videos de la película",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Obtiene los detalles de una película específica.
   * @param {number} movieId
   * @returns {Promise<any>}
   * @throws {HttpException}
   */
  async getMovieDetailsService(movieId: number): Promise<any> {
    this.logger.debug(`Ejecutando getMovieDetails para movieId: ${movieId}`);
    const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${this.apiKey}`;
    try {
      const response$ = this.httpService
        .get(url)
        .pipe(map((response) => response.data));

      const data = await lastValueFrom(response$);
      if (!data) {
        throw new Error("No se pudo obtener los detalles de la película");
      }

      return data;
    } catch (error) {
      this.logger.error("Error in getMovieDetails");
      throw new HttpException(
        "No se pudieron obtener los detalles de la película",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
