export interface In_Out_Put {
    name: string;
    description: string;
    type: string;
    options: any; // todo: define
    required: boolean;
}

export class ModelCard {
    id: string;
    aiModelId: string;
    name: string;
    author: string;
    version: string;
    framework: string;
    // type: [TYPE];
    date: Date;
    description: string;
    // documentation: [TYPE];
    license: string;
    contact: string;
    citation: string;
    inputs: In_Out_Put[];
    outputs: In_Out_Put[];
    // trainingData: [TYPE];
    publiclyShared: boolean = true;
    _links: any;
}
