export class AiModelCard {
    id: string;
    aiModelId: string;
    name: string;
    author: string;
    version: string;
    framework: string;
    type: string;
    architecture: string;
    date: Date;
    training: number[];
    testing: number[];
    description: string;
    // documentation: [TYPE];
    license: string;
    contact: string;
    citation: string;
    // inputs: In_Out_Put[];
    // outputs: In_Out_Put[];
    // trainingData: [TYPE];
    publiclyShared: boolean = true;
    _links: any;
}
