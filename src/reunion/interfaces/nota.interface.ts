import { UsersEntity } from "src/users/entities/users.entity";
import { ReunionEntity } from "../entities/reunion.entity";

export interface INota { 
    id: string;
    reunion: ReunionEntity;
    usuario: UsersEntity;
    contenido: string;
    hora: string;
    fecha: Date;
}