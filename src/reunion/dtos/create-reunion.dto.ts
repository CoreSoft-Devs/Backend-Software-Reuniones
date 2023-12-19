import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { date } from 'joi';
import { EstadoReunion } from 'src/common/constants';

export class CreateReunionDto {

    @ApiProperty({
        example: '',
        type: String,
        description: 'Titulo de la reunion',
    })
    @IsString()
    @IsNotEmpty()
    titulo: string;

    @ApiProperty({
        example: '',
        type: String,
        description: 'Lugar de la reunion',
    })
    @IsString()
    @IsNotEmpty()
    lugar: string;

    @ApiProperty({
        example: '',
        type: String,
        description: 'Descripcion de la reunion',
    })
    @IsString()
    @IsNotEmpty()
    descripcion: string;

    @ApiProperty({
        example: '',
        type: date,
        description: 'Fecha de inicio de la reunion',
    })
    @IsNotEmpty()
    @IsString()
    fechaInicio: string;

    @ApiProperty({
        example: '',
        type: date,
        description: 'Fecha final de la reunion',
    })
    @IsNotEmpty()
    @IsString()
    fechaFinal: string;

    @ApiProperty({
        example: '',
        type: String,
        description: 'Hora de inicio de la reunion',
    })
    @IsString()
    @IsNotEmpty()
    horaInicio: string;

    @ApiProperty({
        example: '',
        type: String,
        description: 'Hora final de la reunion',
    })
    @IsString()
    @IsNotEmpty()
    horaFinal: string;

    @ApiProperty({
        example: 'PENDIENTE',
        type: String,
        description: 'Estado de la reunion',
    })
    @IsString()
    @IsEnum(EstadoReunion)
    @IsOptional()
    estado: EstadoReunion;

}
