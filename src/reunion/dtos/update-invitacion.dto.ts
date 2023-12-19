import { PartialType } from '@nestjs/mapped-types';
import { CreateInvitacionDto } from './create-invitacion.dto';

export class UpdateInvitacionDto extends PartialType(CreateInvitacionDto) {}
