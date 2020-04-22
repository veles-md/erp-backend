import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import config from 'src/config';
import { ERPModule } from 'src/erp';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from 'src/auth';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'development'
          ? 'development.env'
          : 'production.env',
      load: [config],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('database.connection'),
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    ERPModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
