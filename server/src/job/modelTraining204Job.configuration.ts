import { Injectable, Logger } from '@nestjs/common';
import * as tf from '@tensorflow/tfjs';
import { InjectModel } from '@nestjs/mongoose';
import { CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { TrainingInput } from 'src/lambdaResource/trainingInput';
import { JobMeta, JobMetaDocument } from 'src/repository/jobMeta.model';
import { JobRegistryService } from 'src/service/jobRegistry.service';
import { LambdaResourceService } from 'src/service/lambdaResource.service';
import { JobConfiguration, JobDefinition } from './job.interface';
import { JobEventPublisherService } from './jobEventPublisher.service';
import { ModelTrainingJob } from './modelTraining.job';

@Injectable()
export class ModelTraining204JobConfiguration extends JobConfiguration {
  private readonly logger = new Logger(ModelTraining204JobConfiguration.name);

  private static jobDefinition: JobDefinition = new JobDefinition(
    'ModelTraining204Job',
    'Trains models given the the vector input of [204, 1].',
    CronExpression.EVERY_WEEK,
  );

  private static kerasModelString = tf
    .sequential({
      layers: [
        tf.layers.embedding({
          inputDim: 90,
          outputDim: 32,
          inputLength: 204,
          maskZero: true,
        }),
        tf.layers.flatten(),
        tf.layers.dense({
          units: 512,
          inputDim: 6528,
        }),
        tf.layers.dropout({ rate: 0.5 }),
        tf.layers.reLU(),
        tf.layers.dense({
          units: 256,
          inputDim: 512,
        }),
        tf.layers.dropout({ rate: 0.5 }),
        tf.layers.reLU(),
        tf.layers.dense({
          units: 128,
          inputDim: 256,
        }),
        tf.layers.dropout({ rate: 0.5 }),
        tf.layers.reLU(),
        tf.layers.dense({
          units: 1,
          inputDim: 128,
        }),
        tf.layers.activation({
          activation: 'sigmoid',
        }),
      ],
    })
    .toJSON()
    .toString();

  private static trainingInput: TrainingInput = {
    trainingDataFileName: 'training.csv.gz',
    modelStorageName: 'tracking-detector/204-',
    inputVectorDims: [204, 1],
    modelStructure: ModelTraining204JobConfiguration.kerasModelString,
  };

  constructor(
    @InjectModel(JobMeta.name) jobMetaModel: Model<JobMetaDocument>,
    jobEventPublisherService: JobEventPublisherService,
    jobRegistryService: JobRegistryService,
    schedulerRegistry: SchedulerRegistry,
    lambdaResourceService: LambdaResourceService,
  ) {
    super(
      jobMetaModel,
      jobEventPublisherService,
      jobRegistryService,
      schedulerRegistry,
    );
    this.job = new ModelTrainingJob(
      ModelTraining204JobConfiguration.jobDefinition,
      lambdaResourceService,
      ModelTraining204JobConfiguration.trainingInput,
    );
  }

  getLogger(): Logger {
    return this.logger;
  }
}
