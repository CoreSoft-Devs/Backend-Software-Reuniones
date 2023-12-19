import { ReunionEntity } from "src/reunion/entities/reunion.entity";

export interface IUser {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  tokenMobile?: string;
  role: string;
  reuniones?: ReunionEntity[];
}
