import { Module } from '@nestjs/common';
import { AppController, WikiController } from './app.controller';
import { AppService, TranslateService, WikiService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { HttpExceptionFilter } from './http-exception';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [HttpModule],
  controllers: [AppController, WikiController],
  providers: [
    AppService,
    WikiService,
    TranslateService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
