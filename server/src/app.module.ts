import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { HbsModule } from './hbs/hbs.module';
import { JobModule } from './jobs/job.module';
import { RequestModule } from './requests/requests.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forRoot('mongodb://db:27017/tracking'),
    JobModule,
    RequestModule,
    HbsModule
  ],
})
export class AppModule {}
