import { Entity, ManyToOne } from 'typeorm';
import { Column } from 'typeorm/decorator/columns/Column';

import { BaseEntity } from '../../common/entities/base.entity';
import { UsersEntity } from '../../users/entities/users.entity';
import { ReunionEntity } from './reunion.entity';
import { INota } from '../interfaces/nota.interface';

@Entity({ name: 'nota' })
export class NotaEntity extends BaseEntity implements INota {
    @Column({ type: 'time' })
    hora: string;

    @Column({ type: 'date' })
    fecha: Date;

    @Column({ type: 'text' })
    contenido: string;

    @ManyToOne(() => UsersEntity, user => user.reuniones, { onDelete: 'CASCADE' })
    usuario: UsersEntity;

    @ManyToOne(() => ReunionEntity, reunion => reunion.notas, { onDelete: 'CASCADE' })
    reunion: ReunionEntity;
}
