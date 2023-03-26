export interface TrainingInput {
  trainingDataFileName: string;
  modelStorageName: string;
  inputVectorDims: [number, number];
  modelStructure: string;
}
