export class AIModel {
  id: string;
  name: string;
  owner: string;
  machineLearningLibraries: string;
  creationDate: Date;
  sourceJob: string;
  publiclyShared: boolean = true;
  _links: any;
}

export interface PaginatedAIModels {
  page: any;
  data: AIModel[];
  _links: any;
}

export class TensorboardLogs {
  id: string;
  name: string;
  creationDate: Date;
  sourceJob: string;
  owner: string;
  publiclyShared: boolean = true;
  _links: any;
}
