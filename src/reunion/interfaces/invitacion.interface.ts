import { EstadoInvitacion } from "src/common/constants";
import { UsersEntity } from "src/users/entities/users.entity";
import { ReunionEntity } from "../entities/reunion.entity";

export interface IInvitacion { 
    id: string;
    reunion: ReunionEntity;
    usuario: UsersEntity;
    estado: EstadoInvitacion;
    fecha: Date;
    hora: string;
}