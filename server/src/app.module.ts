import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HbsModule } from './hbs/hbs.module';
import { RequestModule } from './requests/requests.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://db:27017/tracking', {
      // auth: {
      //     username: "root",
      //     password: "rootpassword"
      //   }
    }),
    RequestModule,
    HbsModule
  ],
})
export class AppModule {}
