import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { MailService } from './mail.service';

@Module({
  providers: [CloudinaryService, MailService],
  exports: [CloudinaryService, MailService],
})
export class UtilsModule {}
