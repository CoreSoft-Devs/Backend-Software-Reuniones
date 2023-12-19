import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
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
        example: 'ADASDADS-ASDASDASD-ASDASDASD-ASDASDASD',
        type: String,
        description: 'ID del usuario',
    })
    @IsNotEmpty()
    @IsString()
    @IsUUID()
    usuario: string;

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
