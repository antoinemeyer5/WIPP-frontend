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
    // license: [TYPE];
    // contact: [TYPE];
    citation: string;
    // inputs: [TYPE];
    // outputs: [TYPE];
    // trainingData: [TYPE];
    publiclyShared: boolean = true;
    _links: any;
}
