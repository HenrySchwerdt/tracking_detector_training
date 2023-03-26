import { Controller, Get, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Controller('tracking-detector/health')
export class HealthController {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  @Get('alive')
  @HttpCode(200)
  alive(): string {
    return 'OK';
  }

  @Get('mongo')
  mongoDBUp(@Res() res) {
    if (this.connection.readyState === 1) {
      res.status(HttpStatus.OK).json({ db: { status: 'up' } });
    } else {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ db: { status: 'down' } });
    }
  }
}
