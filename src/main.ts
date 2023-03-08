import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

function getConfiguration(configService: ConfigService): {
  port: string;
  hostname: string;
  dbHost: string;
  dbName: string;
} {
  return {
    port: configService.get('LOCAL_PORT'),
    hostname: configService.get('HOST'),
    dbHost: configService.get('DB_HOST'),
    dbName: configService.get('DB_NAME'),
  };
}

function configureOpenApi(app: NestExpressApplication): { url: string } {
  const openApiUrl = 'doc';
  const config = new DocumentBuilder()
    .setTitle('To Do List api')
    .setDescription('To do list api')
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(openApiUrl, app, document);

  return { url: openApiUrl };
}

async function configureApp(): Promise<NestExpressApplication> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      forbidNonWhitelisted: true,
      whitelist: true,
    }),
  );

  return app;
}

async function bootstrap() {
  BigInt.prototype['toJSON'] = function () {
    return parseInt(this);
  };

  const logger = new Logger('Info');
  const app = await configureApp();

  const configService = app.get(ConfigService);
  const configuration = getConfiguration(configService);

  const openApi = configureOpenApi(app);

  await app.listen(configuration.port, configuration.hostname);

  logger.log(`App running in port ${configuration.port}`);
  logger.log(`App Documentation route is /${openApi.url}`);
}
bootstrap();
