import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger';
const actuator = require('express-actuator')
const swStats = require('swagger-stats');

const loggerInstance = new Logger('Bootstrap')
const DEFAULT_API_PORT = 3000

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors()
  app.use(actuator())
  const config = new DocumentBuilder()
    .setTitle('Makima Sender MS')
    .setDescription('Makima Sender MS')
    .setVersion(process.env.npm_package_version)
    .build();
  const options: SwaggerDocumentOptions = {
    operationIdFactory: (
      controllerKey: string,
      methodKey: string
    ) => methodKey
  };
  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('swagger', app, document);

  app.use(swStats.getMiddleware({ swaggerSpec: document }));

  await app.listen(process.env.API_PORT || DEFAULT_API_PORT);
  loggerInstance.log(`Makime Sender MS is running! Application is running on: ${await app.getUrl()}`)
}

bootstrap().catch((error) => loggerInstance.error(error))
