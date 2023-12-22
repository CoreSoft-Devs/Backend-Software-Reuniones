import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { QueryDto } from 'src/common/dto/query.dto';
import { DeleteMessage } from 'src/common/interfaces/delete-message.interface';
import { handlerError } from 'src/common/utils/handlerError.utils';
import { NotaEntity } from '../entities/nota.entity';
import { CreateNotaDto, UpdateNotaDto } from '../dtos';
import { UsersEntity } from 'src/users/entities/users.entity';
import { UserService } from 'src/users/services/users.service';
import { ReunionEntity } from '../entities/reunion.entity';
import { ReunionService } from './reunion.service';

@Injectable()
export class NotaService {

    private readonly logger = new Logger('NotaService');

    constructor(
        @InjectRepository(NotaEntity)
        private readonly notaRepository: Repository<NotaEntity>,
        private readonly userService: UserService,
        private readonly reunionService: ReunionService,
    ) { }

    public async create(createNotaDto: CreateNotaDto, userId: string): Promise<NotaEntity> {
        try {
            const { contenido } = createNotaDto;
            const hora: string = new Date().toLocaleTimeString();
            const fecha: string = new Date().toLocaleDateString();
            const usuario: UsersEntity = await this.userService.findOne(userId);
            const reunion: ReunionEntity = await this.reunionService.findOne(createNotaDto.reunion, userId);
            const nota: NotaEntity = await this.notaRepository.save({ contenido, hora, fecha, usuario, reunion });
            return nota;
        } catch (error) {
            handlerError(error, this.logger);
        }
    }

    public async findAll(queryDto: QueryDto, reunionId: string): Promise<NotaEntity[]> {
        try {
            const { limit, offset, order, attr, value } = queryDto;
            const query = this.notaRepository.createQueryBuilder('nota');
            query.leftJoinAndSelect('nota.usuario', 'usuario');
            query.where('nota.reunion = :reunionId', { reunionId });
            if (limit) query.take(limit);
            if (offset) query.skip(offset);
            if (order) query.orderBy('nota.createdAt', order.toLocaleUpperCase() as any);
            if (attr && value) {
                if (attr === 'usuario') query.andWhere(`usuario.nombre ILIKE :value`, { value: `%${value}%` });
                if (attr === 'fecha')
                    query.andWhere(`nota.${attr}::text ILIKE :value`, { value: `%${value}%` });
            }
            return await query.getMany();
        } catch (error) {
            handlerError(error, this.logger);
        }
    }

    public async findOne(id: string): Promise<NotaEntity> {
        try {
            return await this.notaRepository.findOneOrFail({ where: { id } });
        } catch (error) {
            handlerError(error, this.logger);
        }
    }

    public async update(id: string, updateNotaDto: UpdateNotaDto, userId: string): Promise<NotaEntity> {
        try {
            const { contenido } = updateNotaDto;
            const nota: NotaEntity = await this.notaRepository.findOneOrFail({ where: { id, usuario: { id: userId } } });
            const notaUpdated = await this.notaRepository.update(nota.id, {
                contenido,
            });
            if (notaUpdated.affected === 0) throw new Error('Nota no actualizada');
            return await this.findOne(id);
        } catch (error) {
            handlerError(error, this.logger);
        }
    }

    public async remove(id: string): Promise<DeleteMessage> {
        try {
            const nota = await this.notaRepository.findOneOrFail({ where: { id } });
            const notaDeleted = await this.notaRepository.delete(nota.id);
            if (notaDeleted.affected === 0) throw new Error('Nota no eliminada');
            return { deleted: true, message: 'Nota eliminada.' };
        } catch (error) {
            return { deleted: false, message: 'Nota no eliminada.' };
        }
    }
}
