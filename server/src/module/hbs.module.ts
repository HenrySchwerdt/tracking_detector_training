import { Module } from '@nestjs/common';
import { HbsController } from '../controller/hbs.controller';
import { HbsService } from '../service/hbs.service';
import { JobModule } from './job.module';
import { ModelsModule } from './models.module';
import { RequestsModule } from './requests.module';

@Module({
  imports: [RequestsModule, JobModule, ModelsModule],
  controllers: [HbsController],
  providers: [HbsService],
})
export class HbsModule {}
