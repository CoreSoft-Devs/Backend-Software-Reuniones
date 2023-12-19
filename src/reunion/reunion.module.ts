import { Module } from '@nestjs/common';
import { ReunionService } from './services/reunion.service';
import { ReunionController } from './controllers/reunion.controller';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReunionEntity } from './entities/reunion.entity';
import { NotaEntity } from './entities/nota.entity';
import { InvitacionEntity } from './entities/invitacion.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReunionEntity, NotaEntity, InvitacionEntity]),
    UsersModule
  ],
  controllers: [ReunionController],
  providers: [ReunionService],
})
export class ReunionModule { }
