import { Entity, ManyToOne } from 'typeorm';
import { Column } from 'typeorm/decorator/columns/Column';

import { BaseEntity } from '../../common/entities/base.entity';
import { UsersEntity } from '../../users/entities/users.entity';
import { IInvitacion } from '../interfaces/invitacion.interface';
import { EstadoInvitacion } from '../../common/constants';
import { ReunionEntity } from './reunion.entity';

@Entity({ name: 'invitacion' })
export class InvitacionEntity extends BaseEntity implements IInvitacion {

    @Column({ type: 'time' })
    hora: string;

    @Column({ type: 'date' })
    fecha: Date;

    @Column({ type: 'enum', enum: EstadoInvitacion })
    estado: EstadoInvitacion;

    @ManyToOne(() => UsersEntity, (user: UsersEntity) => user.reuniones, { onDelete: 'CASCADE' })
    usuario: UsersEntity;

    @ManyToOne(() => ReunionEntity, (reunion: ReunionEntity) => reunion.invitados, { onDelete: 'CASCADE' })
    reunion: ReunionEntity;
}
