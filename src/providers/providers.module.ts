import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { Global } from '@nestjs/common/decorators/modules/global.decorator';
import { HttpCustomService } from './http/http.service';
import { EmailService } from './email/email.service';
import { ConfigModule } from '@nestjs/config';
import { NotificationsService } from './firebase/notification.service';

@Global()
@Module({
  imports: [HttpModule, ConfigModule.forRoot()],
  providers: [HttpCustomService, EmailService, NotificationsService],
  exports: [HttpCustomService, HttpModule, EmailService, NotificationsService],
})
export class ProvidersModule { }
