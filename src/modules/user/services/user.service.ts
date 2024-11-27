import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { RegisterUserDto } from "../dto/register-user.dto";
import * as firebaseAdmin from "firebase-admin";
import { LoginDto } from "../dto/login.dto";
import axios from "axios";

@Injectable()
export class UserService {
  async registerUser(registerUser: RegisterUserDto) {
    console.log(registerUser);
    try {
      const userRecord = await firebaseAdmin.auth().createUser({
        displayName: registerUser.firstName,
        email: registerUser.email,
        password: registerUser.password,
      });
      console.log("User Record:", userRecord);
      return userRecord;
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error("User registration failed");
    }
  }

  async loginUser(payload: LoginDto) {
    const { email, password } = payload;
    try {
      const { idToken, refreshToken, expiresIn } =
        await this.signInWithEmailAndPassword(email, password);
      return { idToken, refreshToken, expiresIn };
    } catch (error: any) {
      if (error.message.includes("EMAIL_NOT_FOUND")) {
        throw new Error("User not found.");
      } else if (error.message.includes("INVALID_PASSWORD")) {
        throw new Error("Invalid password.");
      } else {
        throw new Error(error.message);
      }
    }
  }

  private async signInWithEmailAndPassword(email: string, password: string) {
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.APIKEY}`;
    return await this.sendPostRequest(url, {
      email,
      password,
      returnSecureToken: true,
    });
  }
  
  private async sendPostRequest(url: string, data: any) {
    try {
      const response = await axios.post(url, data, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
      console.log("error", error);
    }
  }

  create(createUserDto: CreateUserDto) {
    return "This action adds a new user";
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
