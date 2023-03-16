import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access';
import * as Hbs from 'handlebars'
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as hbs from 'express-handlebars';
import { join } from 'path';
import { AppModule } from './app.module';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));

  const hbsObj = hbs.create({
    layoutsDir: join(__dirname, '..', 'views', 'layouts'),
    partialsDir: join(__dirname, '..', 'views', 'partials'),
    extname: 'hbs',
    defaultLayout: 'main',
    handlebars: allowInsecurePrototypeAccess(Hbs),
    helpers: {
      formatDate(date?: number) {
        if (date == null) {
          return "null";
        }
        return new Date(date).toISOString()
      }
    }
  })

  app.engine('hbs', hbsObj.engine);
  app.setViewEngine('hbs')

  await app.listen(3000);
}
bootstrap();


