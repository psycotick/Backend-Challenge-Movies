import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Query,
  Logger,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { UserService } from "../services/user.service";
import { RegisterUserDto } from "../dto/register-user.dto";
import { LoginDto } from "../dto/login.dto";

/**
 * Controlador de Lógica para manejar las solicitudes relacionadas con los usuarios.
 * @author Santiago Ruiz - santiago.develops@gmail.com
 * @copyright Psycotick Software S.L.
 * @license MIT
 */
@Controller("user")
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  /**
   * Registro de un nuevo usuario.
   * @param {RegisterUserDto} registerUserDto 
   * @returns {Promise<any>}
   * @throws {HttpException} 
   */
  @Post("register")
  @UsePipes(new ValidationPipe({ transform: true }))
  async registerUser(@Body() registerUserDto: RegisterUserDto) {
    try {
      return await this.userService.registerUser(registerUserDto);
    } catch (error) {
      this.logger.error("Error registering user");
      throw new HttpException(
        "Error registering user",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Inicio de sesión de un usuario.
   * @param {LoginDto} loginDto 
   * @returns {Promise<any>} 
   * @throws {HttpException} 
   */
  @Post("login")
  @UsePipes(new ValidationPipe({ transform: true }))
  async login(@Body() loginDto: LoginDto) {
    try {
      return await this.userService.loginUser(loginDto);
    } catch (error) {
      this.logger.error("Error logging in user");
      throw new HttpException(
        "Error logging in user",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Actualización del token de autenticación.
   * @param {string} refreshToken 
   * @returns {Promise<any>}
   * @throws {HttpException}
   */
  @Post("refresh-auth")
  async refreshAuth(@Query("refreshToken") refreshToken: string) {
    try {
      return await this.userService.refreshAuthToken(refreshToken);
    } catch (error) {
      this.logger.error("Error refreshing authentication token");
      throw new HttpException(
        "Error refreshing authentication token",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
