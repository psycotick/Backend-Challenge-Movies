import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class RegisterUserDto {
    @ApiProperty({ description: "The user's first name" })
    @IsNotEmpty()
    @IsString()
    firstName: string;

    @ApiProperty({ description: "The user's last name" })
    @IsNotEmpty()
    @IsString()
    lastName: string;

    @ApiProperty({ description: "The user's email address" })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({ description: "The user's phone number" })
    @IsNotEmpty()
    phoneNumber: string;

    @ApiProperty({ description: "The user's password" })
    @IsNotEmpty()
    @Length(8, 20)
    password: string;

    constructor(firstName: string, lastName: string, email: string, phoneNumber: string, password: string) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.password = password;
    }
}
