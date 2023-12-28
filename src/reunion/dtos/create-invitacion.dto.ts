import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { EstadoInvitacion } from 'src/common/constants';

export class CreateInvitacionDto {

    @ApiProperty({
        example: 'PENDIENTE',
        type: String,
        description: 'Estado de la invitacion',
    })
    @IsString()
    @IsEnum(EstadoInvitacion)
    @IsOptional()
    estado: EstadoInvitacion;

    @ApiProperty({
        example: 'invitado@example.com',
        type: String,
        description: 'email del usuario',
    })
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty({
        example: 'ADASDADS-ASDASDASD-ASDASDASD-ASDASDASD',
        type: String,
        description: 'ID de la reunion',
    })
    @IsNotEmpty()
    @IsString()
    @IsUUID()
    reunion: string;

}
