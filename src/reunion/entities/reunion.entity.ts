import { Entity, ManyToOne, OneToMany } from 'typeorm';
import { Column } from 'typeorm/decorator/columns/Column';

import { BaseEntity } from '../../common/entities/base.entity';
import { IReunion } from '../interfaces/reunion.interface';
import { EstadoReunion } from '../../common/constants';
import { UsersEntity } from '../../users/entities/users.entity';
import { InvitacionEntity } from './invitacion.entity';
import { NotaEntity } from './nota.entity';

@Entity({ name: 'reunion' })
export class ReunionEntity extends BaseEntity implements IReunion {

    @Column({ nullable: true, type: 'varchar', length: 200 })
    titulo: string;

    @Column({ nullable: true, type: 'varchar' })
    lugar: string;

    @Column({ nullable: true, type: 'text' })
    descripcion: string;

    @Column({ type: 'date' })
    fechaInicio: Date;

    @Column({ type: 'date' })
    fechaFinal: Date;

    @Column({ type: 'time' })
    horaInicio: string;

    @Column({ type: 'time' })
    horaFinal: string;

    @Column({ type: 'enum', enum: EstadoReunion })
    estado: EstadoReunion;

    @ManyToOne(() => UsersEntity, user => user.reuniones, { onDelete: 'CASCADE' })
    usuario: UsersEntity;

    @OneToMany(() => InvitacionEntity, invitacion => invitacion.reunion)
    invitados: InvitacionEntity[];

    @OneToMany(() => NotaEntity, nota => nota.reunion)
    notas: NotaEntity[];
}
