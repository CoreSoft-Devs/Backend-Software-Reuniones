import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength, } from 'class-validator';
import { ROLES } from 'src/common/constants';

export class CreateUserDto {
  @ApiProperty({
    example: 'John Doe',
    type: String,
    description: 'Nombre del usuario',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  nombre: string;

  @ApiProperty({
    example: 'John Doe',
    type: String,
    description: 'Apellido del usuario',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  apellido: string;

  @ApiProperty({
    example: 'john@live.com',
    type: String,
    description: 'Correo electrónico del usuario',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '123456',
    type: String,
    description: 'Contraseña del usuario',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: 'FSDFDSFAF-DSFDSFDSF-DSFDSFDSF',
    type: String,
    description: 'Token de autenticación móvil del usuario',
  })
  @IsString()
  tokenMobile?: string;

  @ApiProperty({
    example: 'admin',
    enum: ROLES,
    description: 'Rol del usuario',
  })
  @IsNotEmpty()
  @IsString()
  @IsEnum(ROLES)
  role: ROLES;
}
