import { Controller, Get, Logger } from "@nestjs/common";
import { AppService } from "../services/app.service";

/**
 * Controlador de App General de las películas
 * @author Santiago Ruiz - santiago.develops@gmail.com
 * @copyright Psycotick Software S.L.
 * @license MIT
 */

@Controller()
export class AppController {
  private readonly log: Logger;

  public constructor(private readonly appService: AppService) {
    this.log = new Logger(AppController.name);
  }

  /**
   * Endpoint para obtener un mensaje de bienvenida.
   * @returns {string} - Un mensaje de bienvenida.
   */
  @Get()
  public getHello(): string {
    this.log.debug("Iniciando el app");
    try {
      const message = this.appService.getHello();
      this.log.debug("Mensaje obtenido con éxito");
      return message;
    } catch (error) {
      this.log.error("Error al obtener el mensaje");
      throw new Error("No se pudo obtener el mensaje de bienvenida");
    }
  }
}
