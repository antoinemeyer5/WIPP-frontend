export class AiModelCard
{
    id: string;
    version: string;

    aiModelId: string;
    name: string;
    date: Date;
    framework: string;

    trainingData: Map<string, string>;

    author: string;
    description: string;
    citation: string;
    operationType: string;
    architecture: string;
    
    training: Map<string, number>;
    testing: Map<string, number>;

    license: string;

    publiclyShared: boolean = true;
    _links: any;
}
