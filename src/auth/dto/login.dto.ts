import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'peterparker@gmail.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'Peter@123123', minLength: 8 })
  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  password!: string;
}
