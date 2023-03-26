import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { StatusMonitorModule } from 'nestjs-status-monitor';
import { HbsModule } from './module/hbs.module';
import { HealthController } from './health.controller';
import { JobModule } from './module/job.module';
import { ModelsModule } from './module/models.module';
import { RequestsModule } from './module/requests.module';

@Module({
  imports: [
    StatusMonitorModule.forRoot({
      title: 'NestJS Status', // Default title
      path: '/tracking-detector/internal/status',
      socketPath: '/tracking-detector/internal/socket.io', // In case you use a custom path
      port: 3000, // Defaults to NestJS port
      spans: [
        {
          interval: 1, // Every second
          retention: 60, // Keep 60 datapoints in memory
        },
        {
          interval: 5, // Every 5 seconds
          retention: 60,
        },
        {
          interval: 15, // Every 15 seconds
          retention: 60,
        },
      ],
      chartVisibility: {
        cpu: true,
        mem: true,
        load: true,
        responseTime: true,
        rps: true,
        statusCodes: true,
      },
      ignoreStartsWith: [], // paths to ignore for responseTime stats
      healthChecks: [
        {
          protocol: 'http',
          host: 'localhost',
          path: '/tracking-detector/health/alive',
          port: 3000,
        },
        {
          protocol: 'http',
          host: 'localhost',
          path: '/tracking-detector/health/mongo',
          port: 3000,
        },
      ],
    }),
    ScheduleModule.forRoot(),
    MongooseModule.forRoot('mongodb://db:27017/tracking'),
    JobModule,
    RequestsModule,
    HbsModule,
    ModelsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
