import { Injectable } from '@nestjs/common';

@Injectable()
export class HbsService {
  getHello(): string {
    return 'Hello World';
  }
}
