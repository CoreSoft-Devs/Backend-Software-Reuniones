import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { QueryDto } from 'src/common/dto/query.dto';
import { DeleteMessage } from 'src/common/interfaces/delete-message.interface';
import { handlerError } from 'src/common/utils/handlerError.utils';
import { InvitacionEntity } from '../entities/invitacion.entity';
import { CreateInvitacionDto } from '../dtos';
import { ReunionService } from './reunion.service';
import { ReunionEntity } from '../entities/reunion.entity';
import { UsersEntity } from 'src/users/entities/users.entity';
import { UserService } from 'src/users/services/users.service';
import { EstadoInvitacion } from 'src/common/constants';
import { EmailService } from 'src/providers/email/email.service';
import { NotificationsService } from 'src/providers/firebase/notification.service';
import { DataNotification } from 'src/providers/firebase/interfaces/dataNotification.interface';

@Injectable()
export class InvitacionService {
    private readonly logger = new Logger('InvitacionService');

    constructor(
        @InjectRepository(InvitacionEntity) private readonly invitacionRepository: Repository<InvitacionEntity>,
        private readonly reunionService: ReunionService,
        private readonly userService: UserService,
        private readonly emailService: EmailService,
        private readonly notificationService: NotificationsService
    ) { }

    public async create(createInvitacionDto: CreateInvitacionDto, userId: string): Promise<InvitacionEntity> {
        try {
            const { estado = EstadoInvitacion.PENDIENTE } = createInvitacionDto;
            const hora: string = new Date().toLocaleTimeString();
            const fecha: string = new Date().toLocaleDateString();
            const usuario: UsersEntity = await this.userService.findOneBy({ key: 'email', value: createInvitacionDto.email });
            const reunion: ReunionEntity = await this.reunionService.findOne(createInvitacionDto.reunion, userId);
            if (await this.existInvitacion(usuario.id, reunion.id)) throw new BadRequestException('Ya se ha enviado una invitacion a este usuario.');
            const invitacion: InvitacionEntity = await this.invitacionRepository.save({ estado, reunion, usuario, hora, fecha });
            this.sendEmail(usuario, reunion);
            this.sendNotification(usuario, reunion);
            return invitacion;
        } catch (error) {
            handlerError(error, this.logger);
        }
    }

    public async findAll(queryDto: QueryDto, reunionId: string): Promise<InvitacionEntity[]> {
        try {
            const { limit, offset, order, attr, value } = queryDto;
            const query = this.invitacionRepository.createQueryBuilder('invitacion');
            query.leftJoinAndSelect('invitacion.usuario', 'usuario');
            query.leftJoinAndSelect('invitacion.reunion', 'reunion');
            query.where('invitacion.reunion = :reunionId', { reunionId });
            if (limit) query.take(limit);
            if (offset) query.skip(offset);
            if (order) query.orderBy('invitacion.createdAt', order.toLocaleUpperCase() as any);
            if (attr && value) {
                if (attr === 'usuario') query.andWhere(`usuario.nombre ILIKE :value`, { value: `%${value}%` });
                if (attr === 'estado') query.andWhere(`invitacion.${attr} = :value`, { value });
                if (attr === 'fecha')
                    query.andWhere(`invitacion.${attr}::text ILIKE :value`, { value: `%${value}%` });
            }
            return await query.getMany();
        } catch (error) {
            handlerError(error, this.logger);
        }
    }

    public async findOne(id: string): Promise<InvitacionEntity> {
        try {
            return await this.invitacionRepository.findOneOrFail({ where: { id }, relations: ['usuario'] });
        } catch (error) {
            handlerError(error, this.logger);
        }
    }



    private async existInvitacion(userID: string, reunionId: string): Promise<boolean> {
        try {
            const invitacion = await this.invitacionRepository.findOne({ where: { usuario: { id: userID }, reunion: { id: reunionId } } });
            return invitacion ? true : false;
        } catch (error) {
            handlerError(error, this.logger);
        }
    }

    public async update(reunionId: string, userInvitadoId: string): Promise<InvitacionEntity> {
        try {
            const invitacion: InvitacionEntity = await this.invitacionRepository.findOneOrFail({ where: { usuario: { id: userInvitadoId }, reunion: { id: reunionId } }, relations: ['usuario', 'reunion'] });
            if (invitacion.estado === EstadoInvitacion.ACEPTADO) throw new BadRequestException('Invitacion ya aceptada.');
            const invitacionUpdated = await this.invitacionRepository.update(invitacion.id, { estado: EstadoInvitacion.ACEPTADO });
            if (invitacionUpdated.affected === 0) throw new BadRequestException('Invitacion no actualizada.');
            return await this.findOne(invitacion.id);
        } catch (error) {
            handlerError(error, this.logger);
        }
    }

    public async remove(id: string): Promise<DeleteMessage> {
        try {
            const invitacion = await this.invitacionRepository.findOneOrFail({ where: { id } });
            const deletedInvitacion = await this.invitacionRepository.delete(invitacion.id);
            if (deletedInvitacion.affected === 0) throw new BadRequestException('Invitacion no eliminado.');
            return { deleted: true, message: 'Invitacion eliminada.' };
        } catch (error) {
            return { deleted: false, message: 'Invitacion no eliminada.' };
        }
    }

    private async sendEmail(usuario: UsersEntity, reunion: ReunionEntity) {
        try {
            const { email } = usuario;
            const url: string = process.env.APP_URL
            const urlConfirmacion: string = `${url}/invitacion/${reunion.id}/${usuario.id}`;
            const isSend = await this.emailService.sendEmail({
                subject: 'Invitacion a reunion',
                to: 'zvnahuel63@gmail.com',
                html: `
                <h1>Invitacion a reunion</h1>
                <p>Se te ha invitado a la reunion ${reunion.titulo}</p>
                <p>Fecha: ${reunion.fechaInicio} a ${reunion.fechaFinal}</p>
                <p>Hora: ${reunion.horaInicio} a ${reunion.horaFinal}</p>
                <p>Descripcion: ${reunion.descripcion}</p>
                <p>Para aceptar la invitacion ingresa al siguiente link</p>
                <a href="${urlConfirmacion}}">Aceptar invitacion</a>
            `
            });
            if (!isSend) this.logger.error('Error al enviar el email a ' + email + 'para la reunion: ' + reunion.titulo);
        } catch (error) {
            this.logger.error(error);
        }
    }

    private async sendNotification(user: UsersEntity, reunion: ReunionEntity) {
        try {
            const { tokenMobile } = user;
            if (!tokenMobile) return;
            const url: string = process.env.APP_URL
            const urlConfirmacion: string = `${url}/invitacion/${reunion.id}/${user.id}`;

            const dataNotification: DataNotification = {
                to: tokenMobile,
                notification: {
                    title: 'Invitacion a reunion',
                    body: `Se te ha invitado a la reunion ${reunion.titulo}`
                },
                data: {
                    url: urlConfirmacion
                }
            }
            const isNotificated = this.notificationService.sendNotification(dataNotification);
            if (!isNotificated) this.logger.error('Error al enviar la notificacion a ' + user.email + 'para la reunion: ' + reunion.titulo);
        } catch (error) {
            this.logger.error(error);
        }
    }
}
