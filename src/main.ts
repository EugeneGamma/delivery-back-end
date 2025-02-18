import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: "http://localhost:5173",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials:true
  })

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  const config = new DocumentBuilder()
      .setTitle("Delivery API")
      .setDescription("API для доставки еды")
      .setVersion("1.1")
      .addBearerAuth()
      .build()
  const document = SwaggerModule.createDocument(app,config);
  SwaggerModule.setup("api",app,document)

  await app.listen(3000);
}
bootstrap();