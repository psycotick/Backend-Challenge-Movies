import {
  Controller,
  Get,
  Param,
  Query,
  UsePipes,
  ValidationPipe,
  Logger,
} from "@nestjs/common";
import { MovieService } from "../services/movie.service";
import { FilterMoviesDto } from "../dto/filter-movies.dto";

/**
 * Controlador de Logíca para manejar las solicitudes relacionadas con las películas.
 * @author Santiago Ruiz - santiago.develops@gmail.com
 * @copyright Psycotick Software S.L.
 * @license MIT
 */

@Controller("movie")
export class MovieController {
  private readonly logger = new Logger(MovieController.name);

  constructor(private readonly movieService: MovieService) {}

  /**
   * Obtener las películas populares.
   * @returns {Promise<any>} - Una promesa que resuelve con la lista de películas populares.
   */
  @Get("popular")
  async getPopularMovies(): Promise<any> {
    try {
      return await this.movieService.getPopularMoviesService();
    } catch (error) {
      this.logger.error("Error al obtener películas populares");
      throw new Error("No se pudieron obtener las películas populares");
    }
  }

  /**
   * Filtrar películas según criterios específicos.
   * @param {FilterMoviesDto} filterMoviesDto - DTO para filtrar películas.
   * @returns {Promise<any>} - Una promesa que resuelve con la lista de películas filtradas.
   */
  @Get("filter")
  @UsePipes(new ValidationPipe({ transform: true }))
  async getFilterMovies(
    @Query() filterMoviesDto: FilterMoviesDto,
  ): Promise<any> {
    try {
      return await this.movieService.getFilterMoviesService(filterMoviesDto);
    } catch (error) {
      this.logger.error("Error al filtrar películas");
      throw new Error("No se pudieron filtrar las películas");
    }
  }

  /**
   * Obtener las películas en cartelera.
   * @returns {Promise<any>} - Una promesa que resuelve con la lista de películas en cartelera.
   */
  @Get("now_playing")
  async getNowPlayingMovies(): Promise<any> {
    try {
      return await this.movieService.getNowPlayingMoviesService();
    } catch (error) {
      this.logger.error("Error al obtener películas en cartelera");
      throw new Error("No se pudieron obtener las películas en cartelera");
    }
  }

  /**
   * Obtener las próximas películas a estrenarse.
   * @returns {Promise<any>} - Una promesa que resuelve con la lista de próximas películas.
   */
  @Get("upcoming")
  async getUpcomingMovies(): Promise<any> {
    try {
      return await this.movieService.getUpcomingMoviesService();
    } catch (error) {
      this.logger.error("Error al obtener próximas películas");
      throw new Error("No se pudieron obtener las próximas películas");
    }
  }

  /**
   * Obtener las películas mejor valoradas.
   * @returns {Promise<any>} - Una promesa que resuelve con la lista de películas mejor valoradas.
   */
  @Get("top_rated")
  async getTopRatedMovies(): Promise<any> {
    try {
      return await this.movieService.getTopRatedMoviesService();
    } catch (error) {
      this.logger.error("Error al obtener películas mejor valoradas");
      throw new Error("No se pudieron obtener las películas mejor valoradas");
    }
  }

  /**
   * Descubrir películas basadas en un género o palabras clave.
   * @param {string} id - ID del género.
   * @param {string} keywords - Palabras clave para la búsqueda.
   * @returns {Promise<any>} - Una promesa que resuelve con la lista de películas descubiertas.
   */
  @Get("discover")
  async getDiscoverMovies(
    @Query("id") id?: string,
    @Query("keywords") keywords?: string,
  ): Promise<any> {
    try {
      return await this.movieService.getDiscoverMoviesService(id, keywords);
    } catch (error) {
      this.logger.error("Error al descubrir películas");
      throw new Error("No se pudieron descubrir las películas");
    }
  }

  /**
   * Buscar películas por término.
   * @param {string} term - Término de búsqueda.
   * @returns {Promise<any>} - Una promesa que resuelve con la lista de películas buscadas.
   */
  @Get("search")
  async getSearchedMovies(@Query("term") term: string): Promise<any> {
    try {
      return await this.movieService.getSearchedMoviesService(term);
    } catch (error) {
      this.logger.error("Error al buscar películas");
      throw new Error("No se pudieron buscar las películas");
    }
  }

  /**
   * Obtener géneros de películas.
   * @returns {Promise<any>} - Una promesa que resuelve con la lista de géneros de películas.
   */
  @Get("genres")
  async getMovieGenres(): Promise<any> {
    try {
      return await this.movieService.getMovieGenresService();
    } catch (error) {
      this.logger.error("Error al obtener géneros de películas");
      throw new Error("No se pudieron obtener los géneros de películas");
    }
  }

  /**
   * Obtener la lista de películas.
   * @param {string} id - ID de la lista de películas.
   * @returns {Promise<any>} - Una promesa que resuelve con la lista de películas.
   */
  @Get("list-movies")
  async getListMovies(@Query("id") id: string): Promise<any> {
    try {
      return await this.movieService.getListMoviesService(id);
    } catch (error) {
      this.logger.error("Error al obtener la lista de películas");
      throw new Error("No se pudo obtener la lista de películas");
    }
  }

  /**
   * Obtener videos de una película específica.
   * @param {string} id - ID de la película.
   * @returns {Promise<any>} - Una promesa que resuelve con la lista de videos de la película.
   */
  @Get(":id/videos")
  async getMovieVideos(@Param("id") id: string): Promise<any> {
    try {
      return await this.movieService.getMovieVideosService(id);
    } catch (error) {
      this.logger.error("Error al obtener videos de la película");
      throw new Error("No se pudieron obtener los videos de la película");
    }
  }

  /**
   * Obtener detalles de una película específica.
   * @param {number} id - ID de la película.
   * @returns {Promise<any>} - Una promesa que resuelve con los detalles de la película.
   */
  @Get(":id")
  async getMovie(@Param("id") id: number): Promise<any> {
    try {
      return await this.movieService.getMovieDetailsService(Number(id));
    } catch (error) {
      this.logger.error("Error al obtener los detalles de la película");
      throw new Error("No se pudieron obtener los detalles de la película");
    }
  }
}
