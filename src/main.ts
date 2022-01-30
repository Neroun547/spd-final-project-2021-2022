import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { resolve } from "path";
import { create } from 'express-handlebars';
import { secretCookie } from "config.json";
import * as cookieParser from "cookie-parser";
import { ValidationPipe } from "@nestjs/common";
import { ErrorFilter } from "./error-filter/error-filter";
import { appPort } from "config.json"; 

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
  );
  
  app.useGlobalPipes(new ValidationPipe());
  
  app.useGlobalFilters(new ErrorFilter());

  const hbs = create({ 
    extname:"hbs"
  });

  app.engine('hbs', hbs.engine);
  app.set('view engine', 'hbs');
  app.set("views", resolve("views"));

  app.useStaticAssets(resolve("static"));  

  app.use(cookieParser(secretCookie));

  await app.listen(appPort);
}

bootstrap();
