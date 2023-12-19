import { EstadoReunion } from "src/common/constants";
import { UsersEntity } from "src/users/entities/users.entity";
import { InvitacionEntity } from "../entities/invitacion.entity";
import { NotaEntity } from "../entities/nota.entity";

export interface IReunion {
    id: string;
    titulo: string;
    descripcion: string;
    lugar: string;
    fechaInicio: Date;
    fechaFinal: Date;
    horaInicio: string;
    horaFinal: string;
    usuario: UsersEntity;
    estado: EstadoReunion;
    invitados: InvitacionEntity[];
    notas: NotaEntity[];
}