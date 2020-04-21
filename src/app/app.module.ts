import { Module } from '@nestjs/common';

import { ERPModule } from 'src/erp';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [ERPModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
