import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app/app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { Logger } from "@nestjs/common";
import * as chalk from "chalk";
import * as dotenv from "dotenv";
import * as firebaseAdmin from "firebase-admin";
import * as fs from "fs";

dotenv.config();

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("apis/");

  app.enableCors({
    origin: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle("User Authentication")
    .setDescription(
      "Los detalles de la API para la aplicación de demostración de autenticación de usuario que utiliza Firebase en el backend de NestJS.",
    )
    .setVersion("1.0")
    .addTag("Authentication")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  // Firebase ;
  const firebaseKeyFilePath =
    "./movies-appweb-auth-firebase-adminsdk-is01r-7f6e0ff8ec.json";
  const firebaseServiceAccount /*: ServiceAccount*/ = JSON.parse(
    fs.readFileSync(firebaseKeyFilePath).toString(),
  );
  if (firebaseAdmin.apps.length === 0) {
    Logger.log(
      chalk.bold.white(
        "Inicializando firebase con el archivo de clave exitosamente...",
      ),
      "Debug",
    );
    firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert(firebaseServiceAccount),
    });
  }

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  Logger.log(
    chalk.bold.blue(process.env.APPLICATION_NAME) +
      chalk.bold.yellow(" Running On Port ") +
      chalk.bold.green(`http://localhost:${port}/apis`),
    "Bootstrap",
  );

  Logger.log(chalk.bold.cyan("Autor: Santiago Ruiz"), "Mensaje del autor");

  Logger.log(
    chalk.bold.green("¡La aplicación se ejecutó exitosamente...!"),
    "Éxito",
  );
}

void bootstrap();
