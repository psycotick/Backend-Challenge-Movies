import { Injectable, Logger } from "@nestjs/common";
import { RegisterUserDto } from "../dto/register-user.dto";
import * as firebaseAdmin from "firebase-admin";
import { LoginDto } from "../dto/login.dto";
import axios from "axios";

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  /**
   * Registra un nuevo usuario en Firebase Authentication.
   * @param {RegisterUserDto} registerUser
   * @returns {Promise<any>}
   * @throws {Error}
   */
  async registerUser(registerUser: RegisterUserDto) {
    this.logger.debug("Ejecutando registerUser");
    console.log(registerUser);
    try {
      const userRecord = await firebaseAdmin.auth().createUser({
        email: registerUser.email,
        password: registerUser.password,
      });
      this.logger.debug("User Record:", userRecord);
      return userRecord;
    } catch (error) {
      this.logger.error("Error creating user");
      throw new Error("User registration failed");
    }
  }

  /**
   * Inicia sesión de un usuario utilizando Firebase Authentication.
   * @param {LoginDto} payload
   * @returns {Promise<any>}
   * @throws {Error}
   */
  async loginUser(payload: LoginDto) {
    this.logger.debug("Ejecutando loginUser");
    const { email, password } = payload;
    try {
      const { idToken, refreshToken, expiresIn } =
        await this.signInWithEmailAndPassword(email, password);
      return { idToken, refreshToken, expiresIn };
    } catch (error: any) {
      if (error.message.includes("EMAIL_NOT_FOUND")) {
        this.logger.error("User not found");
        throw new Error("User not found.");
      } else if (error.message.includes("INVALID_PASSWORD")) {
        this.logger.error("Invalid password");
        throw new Error("Invalid password.");
      } else {
        this.logger.error("Login failed");
        throw new Error(error.message);
      }
    }
  }

  /**
   * Refresca el token de autenticación utilizando un refresh token.
   * @param {string} refreshToken
   * @returns {Promise<any>}
   * @throws {Error}
   */
  async refreshAuthToken(refreshToken: string) {
    this.logger.debug("Ejecutando refreshAuthToken");
    try {
      const {
        id_token: idToken,
        refresh_token: newRefreshToken,
        expires_in: expiresIn,
      } = await this.sendRefreshAuthTokenRequest(refreshToken);
      return {
        idToken,
        refreshToken: newRefreshToken,
        expiresIn,
      };
    } catch (error: any) {
      if (error.message.includes("INVALID_REFRESH_TOKEN")) {
        this.logger.error("Invalid refresh token");
        throw new Error(`Invalid refresh token: ${refreshToken}.`);
      } else {
        this.logger.error("Failed to refresh token");
        throw new Error("Failed to refresh token");
      }
    }
  }

  /**
   * Envía una solicitud para refrescar el token de autenticación.
   * @param {string} refreshToken
   * @returns {Promise<any>}
   */
  private async sendRefreshAuthTokenRequest(refreshToken: string) {
    this.logger.debug("Ejecutando sendRefreshAuthTokenRequest");
    const url = `https://securetoken.googleapis.com/v1/token?key=${process.env.APIKEY}`;
    const payload = {
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    };
    return await this.sendPostRequest(url, payload);
  }

  /**
   * Inicia sesión con email y contraseña utilizando Firebase Authentication.
   * @param {string} email
   * @param {string} password
   * @returns {Promise<any>} .
   */
  private async signInWithEmailAndPassword(email: string, password: string) {
    this.logger.debug("Ejecutando signInWithEmailAndPassword");
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.APIKEY}`;
    return await this.sendPostRequest(url, {
      email,
      password,
      returnSecureToken: true,
    });
  }

  /**
   * Envía una solicitud POST a una URL específica.
   * @param {string} url
   * @param {any} data
   * @returns {Promise<any>}
   * @throws {Error}
   */
  private async sendPostRequest(url: string, data: any) {
    this.logger.debug("Ejecutando sendPostRequest");
    try {
      const response = await axios.post(url, data, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
      this.logger.error("Error in sendPostRequest");
      throw new Error("Failed to send post request");
    }
  }

  /**
   * Valida una solicitud verificando el token de autorización.
   * @param {any} req
   * @returns {Promise<boolean>}
   */
  async validateRequest(req): Promise<boolean> {
    this.logger.debug("Ejecutando validateRequest");
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      this.logger.error("Authorization header not provided");
      return false;
    }
    const [bearer, token] = authHeader.split(" ");
    if (bearer !== "Bearer" || !token) {
      this.logger.error(
        'Invalid authorization format. Expected "Bearer <token>"',
      );
      return false;
    }
    try {
      const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
      this.logger.debug("Decoded Token:", decodedToken);
      return true;
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message.includes("auth/id-token-expired")) {
          this.logger.error("Token has expired");
        } else if (error.message.includes("auth/invalid-id-token")) {
          this.logger.error("Invalid ID token provided");
        } else {
          this.logger.error("Error verifying token");
        }
      } else {
        this.logger.error("Unknown error occurred during token verification");
      }
      return false;
    }
  }
}
