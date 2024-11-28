import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { UserModule } from "src/modules/user/user.module";
import { AuthGuard } from "src/guards/auth.guard";
import { MovieModule } from "src/modules/movie/movie.module";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), UserModule, MovieModule],
  controllers: [AppController],
  providers: [AppService, AuthGuard],
})
export class AppModule {}
