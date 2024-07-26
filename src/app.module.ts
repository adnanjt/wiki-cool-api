import { Module } from '@nestjs/common';
import { AppController, WikiController } from './app.controller';
import { AppService, TranslateService, WikiService } from './app.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [AppController, WikiController],
  providers: [AppService, WikiService, TranslateService],
})
export class AppModule {}
