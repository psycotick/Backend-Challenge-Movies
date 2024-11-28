import { Module } from "@nestjs/common";
import { MovieController } from "./controllers/movie.controller";
import { MovieService } from "./services/movie.service";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [HttpModule],
  providers: [MovieService],
  controllers: [MovieController],
})
export class MovieModule {}
