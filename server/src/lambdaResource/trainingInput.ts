export interface TrainingInput {
  trainingDataFileName: string;
  applicationName: string;
  modelStorageName: string;
  batchSize: number;
  epochs: number;
  inputVectorDims: [number, number];
  modelStructure: string;
}
