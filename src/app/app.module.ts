import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { ENV_SCHEMA } from 'src/env.schema';
import { ERPModule } from 'src/erp';
import { AuthModule } from 'src/auth';
import { UserModule } from 'src/user';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.erp.env'],
      expandVariables: true,
      validationSchema: ENV_SCHEMA,
      validationOptions: {
        abortEarly: true,
        allowUnknow: false,
      },
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const MONGO_HOST = configService.get<string>('DB_HOST');
        const MONGO_USER = configService.get<string>('DB_USER');
        const MONGO_PASS = configService.get<string>('DB_PASS');
        return {
          uri: `mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}/erp-backend`,
          useUnifiedTopology: true,
          useNewUrlParser: true,
          useCreateIndex: true,
        };
      },
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    ERPModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
