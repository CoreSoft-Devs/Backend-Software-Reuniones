import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

import { ReunionService } from '../services/reunion.service';
import { AuthGuard, RolesGuard } from 'src/auth/guards';
import { CreateReunionDto, UpdateReunionDto } from '../dtos';
import { ReunionEntity } from '../entities/reunion.entity';
import { QueryDto } from 'src/common/dto/query.dto';
import { DeleteMessage } from 'src/common/interfaces/delete-message.interface';
import { GetUser } from 'src/auth/decorators';
import { ORDER, ORDER_ENUM } from 'src/common/constants';


@ApiTags('Reuniones')
@UseGuards(AuthGuard, RolesGuard)
@Controller('reunion')
export class ReunionController {

  constructor(private readonly reunionService: ReunionService) { }

  @Post()
  create(
    @Body() createReunionDto: CreateReunionDto,
    @GetUser() userId: string,
  ): Promise<ReunionEntity> {
    return this.reunionService.create(createReunionDto, userId);
  }

  @ApiQuery({ name: 'limit', type: 'number', required: false })
  @ApiQuery({ name: 'offset', type: 'number', required: false })
  @ApiQuery({ name: 'order', enum: ORDER_ENUM, required: false })
  @ApiQuery({ name: 'attr', type: 'string', required: false })
  @ApiQuery({ name: 'value', type: 'string', required: false })
  @Get()
  findAll(
    @Query() queryDto: QueryDto,
    @GetUser() userId: string
  ): Promise<ReunionEntity[]> {
    return this.reunionService.findAll(queryDto, userId);
  }

  @ApiParam({ name: 'id', type: 'string' })
  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() userId: string
  ): Promise<ReunionEntity> {
    return this.reunionService.findOne(id, userId);
  }

  @ApiParam({ name: 'id', type: 'string' })
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateReunionDto: UpdateReunionDto,
    @GetUser() userId: string
  ): Promise<ReunionEntity> {
    return this.reunionService.update(id, updateReunionDto, userId);
  }

  @ApiParam({ name: 'id', type: 'string' })
  @Delete(':id')
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() userId: string,
  ): Promise<DeleteMessage> {
    return this.reunionService.remove(id, userId);
  }

}
