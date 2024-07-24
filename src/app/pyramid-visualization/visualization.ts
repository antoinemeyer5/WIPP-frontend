export class Visualization {
  id: string;
  name: string;
  creationDate: Date;
  manifest: any;
  owner: string;
  publiclyShared: boolean;
  iiifDataSource: boolean;
  _links: any;
}

export interface PaginatedVisualization {
  page: any;
  data: Visualization[];
  _links: any;
}
