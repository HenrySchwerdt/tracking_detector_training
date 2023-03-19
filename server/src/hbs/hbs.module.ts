import { Module } from '@nestjs/common';
import { JobModule } from 'src/jobs/job.module';
import { HbsController } from './hbs.controller';
import { HbsService } from './hbs.service';

@Module({
  imports: [JobModule],
  controllers: [HbsController],
  providers: [HbsService],
})
export class HbsModule {}
