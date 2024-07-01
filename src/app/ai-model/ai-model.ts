export class AiModel {
  id: string;
  name: string;
  framework: string;
  owner: string;
  machineLearningLibraries: string;
  creationDate: Date;
  sourceJob: string;
  publiclyShared: boolean = true;
  _links: any;
}

export interface PaginatedAiModels {
  page: any;
  data: AiModel[];
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
