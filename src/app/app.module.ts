import { Module } from "@nestjs/common";
import { AppController } from "./controllers/app.controller";
import { AppService } from "./services/app.service";
import { ConfigModule } from "@nestjs/config";
import { UserModule } from "src/modules/user/user.module";
import { AuthGuard } from "src/guards/auth.guard";
import { MovieModule } from "src/modules/movie/movie.module";

/**
 * Módulo de App General de las películas
 * @author Santiago Ruiz - santiago.develops@gmail.com
 * @copyright Psycotick Software S.L.
 * @license MIT
 */

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), UserModule, MovieModule],
  controllers: [AppController],
  providers: [AppService, AuthGuard],
})
export class AppModule {}
