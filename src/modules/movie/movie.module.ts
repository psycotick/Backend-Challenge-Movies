import { Module } from "@nestjs/common";
import { MovieController } from "./controllers/movie.controller";
import { MovieService } from "./services/movie.service";
import { HttpModule } from "@nestjs/axios";

/**
 * Módulo de Logíca de las películas
 * @author Santiago Ruiz - santiago.develops@gmail.com
 * @copyright Psycotick Software S.L.
 * @license MIT
 */

@Module({
  imports: [HttpModule],
  providers: [MovieService],
  controllers: [MovieController],
})
export class MovieModule {}
