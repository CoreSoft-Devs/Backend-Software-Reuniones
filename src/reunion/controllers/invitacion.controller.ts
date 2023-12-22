import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

import { AuthGuard, RolesGuard } from 'src/auth/guards';
import { QueryDto } from 'src/common/dto/query.dto';
import { DeleteMessage } from 'src/common/interfaces/delete-message.interface';
import { GetUser } from 'src/auth/decorators';
import { InvitacionService } from '../services/invitacion.service';
import { InvitacionEntity } from '../entities/invitacion.entity';
import { CreateInvitacionDto } from '../dtos';
import { ORDER_ENUM } from 'src/common/constants';

@ApiTags('Invitaciones')
@UseGuards(AuthGuard, RolesGuard)
@Controller('invitacion')
export class InvitacionController {

  constructor(private readonly invitacionService: InvitacionService) { }

  @Post()
  create(
    @Body() createInvitacionDto: CreateInvitacionDto,
    @GetUser('id') userId: string,
  ): Promise<InvitacionEntity> {
    return this.invitacionService.create(createInvitacionDto, userId);
  }

  @ApiQuery({ name: 'limit', type: 'number', required: false })
  @ApiQuery({ name: 'offset', type: 'number', required: false })
  @ApiQuery({ name: 'order', enum: ORDER_ENUM, required: false })
  @ApiQuery({ name: 'attr', type: 'string', required: false })
  @ApiQuery({ name: 'value', type: 'string', required: false })
  @ApiParam({ name: 'reunionId', type: 'string', required: true })
  @Get(':reunionId')
  findAll(
    @Query() queryDto: QueryDto,
    @Param('reunionId', ParseUUIDPipe) reunionId: string
  ): Promise<InvitacionEntity[]> {
    return this.invitacionService.findAll(queryDto, reunionId);
  }

  @ApiParam({ name: 'reunionId', type: 'string', required: true })
  @ApiParam({ name: 'usuarioId', type: 'string', required: true })
  @Patch(':reunionId/:usuarioId')
  update(
    @Param('reunionId', ParseUUIDPipe) reunionId: string,
    @Param('usuarioId', ParseUUIDPipe) usuarioId: string,
  ): Promise<InvitacionEntity> {
    return this.invitacionService.update(reunionId, usuarioId);
  }

  @ApiParam({ name: 'id', type: 'string' })
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<DeleteMessage> {
    return this.invitacionService.remove(id);
  }
}
