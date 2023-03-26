import { Injectable } from '@nestjs/common';
import { JobRegistryService } from './jobRegistry.service';

@Injectable()
export class JobRunnerService {
  constructor(private readonly jobRegistryService: JobRegistryService) {}

  async triggerJobByName(id: string) {
    await this.jobRegistryService.getRunnableForJobId(id).start();
  }
}
