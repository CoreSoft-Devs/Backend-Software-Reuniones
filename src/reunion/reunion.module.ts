import { Module } from '@nestjs/common';
import { ReunionService } from './services/reunion.service';
import { ReunionController } from './controllers/reunion.controller';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReunionEntity } from './entities/reunion.entity';
import { NotaEntity } from './entities/nota.entity';
import { InvitacionEntity } from './entities/invitacion.entity';
import { InvitacionController } from './controllers/invitacion.controller';
import { InvitacionService } from './services/invitacion.service';
import { NotaController } from './controllers/nota.controller';
import { NotaService } from './services/nota.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReunionEntity, NotaEntity, InvitacionEntity]),
    UsersModule,
  ],
  controllers: [ReunionController, InvitacionController, NotaController],
  providers: [ReunionService, InvitacionService, NotaService],
  exports: [ReunionService, InvitacionService, NotaService]
})
export class ReunionModule { }
