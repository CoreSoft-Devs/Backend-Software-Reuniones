import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateNotaDto {

    @ApiProperty({
        example: '',
        type: String,
        description: 'Contenido de la nota',
    })
    @IsString()
    @IsNotEmpty()
    contenido: string;

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
