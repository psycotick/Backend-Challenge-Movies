import { Injectable } from "@nestjs/common";

/**
 * Servicio de App General de las películas
 * @author Santiago Ruiz - santiago.develops@gmail.com
 * @copyright Psycotick Software S.L.
 * @license MIT
 */

@Injectable()
export class AppService {
  public getHello(): string {
    return "Hello Worlds!";
  }
}
