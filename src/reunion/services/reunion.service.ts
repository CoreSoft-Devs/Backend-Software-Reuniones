import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ReunionEntity } from '../entities/reunion.entity';
import { CreateReunionDto, UpdateReunionDto } from '../dtos';
import { QueryDto } from 'src/common/dto/query.dto';
import { handlerError } from 'src/common/utils/handlerError.utils';
import { DeleteMessage } from 'src/common/interfaces/delete-message.interface';
import { UserService } from 'src/users/services/users.service';
import { UsersEntity } from 'src/users/entities/users.entity';
import { InvitacionEntity } from '../entities/invitacion.entity';
import { EstadoInvitacion } from 'src/common/constants';

@Injectable()
export class ReunionService {
    private readonly logger = new Logger('ReunionService');

    constructor(
        @InjectRepository(ReunionEntity) private readonly reunionRepository: Repository<ReunionEntity>,
        @InjectRepository(InvitacionEntity) private readonly invitacionRepository: Repository<InvitacionEntity>,
        private readonly userService: UserService
    ) { }

    public async create(createReunionDto: CreateReunionDto, userId: string): Promise<ReunionEntity> {
        try {
            const usuario: UsersEntity = await this.userService.findOne(userId);
            return await this.reunionRepository.save({ ...createReunionDto, usuario });
        } catch (error) {
            handlerError(error, this.logger);
        }
    }

    public async findAllCreate(queryDto: QueryDto, userId: string): Promise<ReunionEntity[]> {
        try {
            const { limit, offset, order, attr, value } = queryDto;
            const query = this.reunionRepository.createQueryBuilder('reunion');
            query.where('reunion.usuario = :userId', { userId });
            if (limit) query.take(limit);
            if (offset) query.skip(offset);
            if (order) query.orderBy('reunion.createdAt', order.toLocaleUpperCase() as any);
            if (attr && value) {
                if (attr === 'usuario') query.andWhere(`usuario.nombre ILIKE :value OR usuario.apellido ILIKE :value`, { value: `%${value}%` });
                else if (attr === 'fecha') query.andWhere(`reunion.fechaInicio = :value OR reunion.fechaFinal = :value`, { value });
                else query.andWhere(`reunion.${attr} ILIKE :value`, { value: `%${value}%` });
            }
            return await query.getMany();
        } catch (error) {
            handlerError(error, this.logger);
        }
    }


    public async findAll(queryDto: QueryDto, userId: string): Promise<ReunionEntity[]> {
        try {
            const reunionesCreadas = await this.findAllCreate(queryDto, userId);
            const reunionesInvitado = await this.getReunionesInvitado(queryDto, userId);
            return [...reunionesCreadas, ...reunionesInvitado];
        } catch (error) {
            handlerError(error, this.logger);
        }
    }

    public async findOne(id: string, userId: string): Promise<ReunionEntity> {
        try {
            return await this.reunionRepository.findOneOrFail({ where: { id, usuario: { id: userId } } });
        } catch (error) {
            handlerError(error, this.logger);
        }
    }

    public async update(id: string, updateReunionDto: UpdateReunionDto, userId: string): Promise<ReunionEntity> {
        try {
            const reunion: ReunionEntity = await this.reunionRepository.findOneOrFail({ where: { id, usuario: { id: userId } }, relations: ['usuario'] });
            const reunionUpdated = await this.reunionRepository.update(reunion.id, { ...updateReunionDto });
            if (reunionUpdated.affected === 0) throw new BadRequestException('Reunion no actualizada.');
            return await this.findOne(id, userId);
        } catch (error) {
            handlerError(error, this.logger);
        }
    }

    public async remove(id: string, userId: string): Promise<DeleteMessage> {
        try {
            const reunion = await this.reunionRepository.findOneOrFail({ where: { id, usuario: { id: userId } } });
            const deletedReunion = await this.reunionRepository.delete(reunion.id);
            if (deletedReunion.affected === 0) throw new BadRequestException('Reunion no eliminado.');
            return { deleted: true, message: 'Reunion eliminada.' };
        } catch (error) {
            return { deleted: false, message: 'Reunion no eliminada.' };
        }
    }

    public async getReunionesInvitado(queryDto: QueryDto, userID: string): Promise<ReunionEntity[]> {
        try {
            const { limit, offset, order, attr, value } = queryDto;
            const query = this.invitacionRepository.createQueryBuilder('invitacion');
            query.leftJoinAndSelect('invitacion.reunion', 'reunion');
            query.where('invitacion.usuario = :userID', { userID });
            query.andWhere('invitacion.estado = :estado', { estado: EstadoInvitacion.ACEPTADO });
            if (limit) query.take(limit);
            if (offset) query.skip(offset);
            if (order) query.orderBy('invitacion.createdAt', order.toLocaleUpperCase() as any);
            if (attr && value) {
                if (attr === 'usuario') query.andWhere(`usuario.nombre ILIKE :value`, { value: `%${value}%` });
                if (attr === 'estado') query.andWhere(`invitacion.${attr} = :value`, { value });
                if (attr === 'fecha')
                    query.andWhere(`invitacion.${attr}::text ILIKE :value`, { value: `%${value}%` });
            }
            const invitaciones = await query.getMany();
            return invitaciones.map(invitacion => invitacion.reunion);
        } catch (error) {
            handlerError(error, this.logger);
        }
    }
}
