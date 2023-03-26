import { Injectable } from '@nestjs/common';
import { CronExpression } from '@nestjs/schedule';
import { JobService } from '../service/job.service';
import { JobRun } from '../repository/jobRun.model';
import { Job, JobDefinition } from './job.interface';
import { JobEventPublisher } from './jobEventPublisher.service';

export const CLEAN_UP_JOB_CRON =
  CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT;

const DELETION_THREASH_HOLD = 2629800000; // One Month in miliseconds

@Injectable()
export class CleanUpJob extends Job {
  constructor(jobDefinition: JobDefinition, private jobService: JobService) {
    super(jobDefinition);
  }

  async execute(jobEventPublisher: JobEventPublisher): Promise<boolean> {
    jobEventPublisher.info('Start loading all JobDefinitions.');
    const jobRuns: JobRun[] = await this.jobService.findAllJobRuns();
    jobEventPublisher.info('Found ' + jobRuns.length + ' JobRuns in the db.');
    const minimumDate = Date.now() - DELETION_THREASH_HOLD;
    jobEventPublisher.info(
      'Start deleting every JobRun after the ',
      new Date(minimumDate).toISOString(),
      '.',
    );
    const numberOfDeletions = await new Promise((resolve) => {
      let deletions = 0;
      jobRuns.forEach(async (run) => {
        if (run.startTime < minimumDate) {
          await this.jobService.deleteJobRunById(run.id);
          deletions++;
        }
      });
      resolve(deletions);
    });
    jobEventPublisher.info(
      'Job finished with ' + numberOfDeletions,
      'deletions.',
    );
    return true;
  }
}
