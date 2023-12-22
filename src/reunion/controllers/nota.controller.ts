import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

import { AuthGuard, RolesGuard } from 'src/auth/guards';
import { QueryDto } from 'src/common/dto/query.dto';
import { DeleteMessage } from 'src/common/interfaces/delete-message.interface';
import { NotaService } from '../services/nota.service';
import { CreateNotaDto, UpdateNotaDto } from '../dtos';
import { NotaEntity } from '../entities/nota.entity';
import { GetUser } from 'src/auth/decorators';
import { ORDER_ENUM } from 'src/common/constants';

@ApiTags('Notas')
@UseGuards(AuthGuard, RolesGuard)
@Controller('nota')
export class NotaController {

    constructor(private readonly notaService: NotaService) { }

    @Post()
    create(
        @Body() createNotaDto: CreateNotaDto,
        @GetUser() userId: string
    ): Promise<NotaEntity> {
        return this.notaService.create(createNotaDto, userId);
    }

    @ApiQuery({ name: 'limit', type: 'number', required: false })
    @ApiQuery({ name: 'offset', type: 'number', required: false })
    @ApiQuery({ name: 'order', enum: ORDER_ENUM, required: false })
    @ApiQuery({ name: 'attr', type: 'string', required: false })
    @ApiQuery({ name: 'value', type: 'string', required: false })
    @ApiParam({ name: 'reunionId', type: 'string', required: true })
    @Get(":reunionId")
    findAll(
        @Query() queryDto: QueryDto,
        @Param('reunionId', ParseUUIDPipe) reunionId: string
    ): Promise<NotaEntity[]> {
        return this.notaService.findAll(queryDto, reunionId);
    }

    // @ApiParam({ name: 'id', type: 'string' })
    // @Get(':id')
    // findOne(@Param('id', ParseUUIDPipe) id: string): Promise<NotaEntity> {
    //     return this.notaService.findOne(id);
    // }

    @ApiParam({ name: 'id', type: 'string' })
    @Patch(':id')
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateNotaDto: UpdateNotaDto,
        @GetUser() userId: string
    ): Promise<NotaEntity> {
        return this.notaService.update(id, updateNotaDto, userId);
    }

    @ApiParam({ name: 'id', type: 'string' })
    @Delete(':id')
    remove(@Param('id', ParseUUIDPipe) id: string): Promise<DeleteMessage> {
        return this.notaService.remove(id);
    }
}
