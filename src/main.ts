import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common'
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(
    new ValidationPipe ({
      whitelist : true,
      forbidNonWhitelisted : true,
      transform : true,
      disableErrorMessages : false
    })
  )
  const configService = app.get(ConfigService);
  const port = configService.get<number>('APP_PORT');
  await app.listen(Number(port), () => {
    console.log(`Server running on: http://localhost:${port}`)
  })
}
bootstrap();
