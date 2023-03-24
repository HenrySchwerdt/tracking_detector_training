export interface Layer {
    type: string;
    input?: number;
    output?: number;
    inputLength?: number;
    maskZero?: boolean;
}


export interface TrainingInput {
    trainingDataFileName: string;
    modelStorageName: string;
    inputVectorDims: [number];
    modelStructure: [Layer];
}