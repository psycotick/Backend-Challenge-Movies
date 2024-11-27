import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, Length } from "class-validator";

export class LoginDto {
  @ApiProperty({ description: "The user's email address" })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: "The user's password" })
  @IsNotEmpty()
  @Length(8, 20)
  password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}
