export class ModelCard
{
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
    inputs: any[];
    outputs: any[];
    // trainingData: [TYPE];
    publiclyShared: boolean = true;
    _links: any;
}
