import { Component, OnInit } from '@angular/core';
import {ImagesCollection} from '../images-collection/images-collection';
import {ImagesCollectionService} from '../images-collection/images-collection.service';
import {Visualization} from '../pyramid-visualization/visualization';
import {Workflow} from '../workflow/workflow';
import {WorkflowService} from '../workflow/workflow.service';
import {PyramidVisualizationService} from '../pyramid-visualization/pyramid-visualization.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  imagesCollections: ImagesCollection[];
  visualizations: Visualization[];
  workflows: Workflow[];
  constructor(
    private imagesCollectionService: ImagesCollectionService,
    private workflowService: WorkflowService,
    private  visualizationService: PyramidVisualizationService) { }

  ngOnInit() {
    const params = {
      pageIndex: 0,
      size: 12,
      sort: 'creationDate,desc'
    };
    this.imagesCollectionService.get(params).subscribe(val => {
      this.imagesCollections = val.data;
    });
    this.visualizationService.getVisualizations(params).subscribe(val => {
      this.visualizations = val.data;
    });
    this.workflowService.getWorkflows(params).subscribe(val => {
      this.workflows = val.workflows;
    });
  }

  getIconByWorkflowStatus(workflow: Workflow) {
    return this.workflowService.getIconByWorkflowStatus(workflow);
  }

  getIconByImgCollStatus(imgColl: ImagesCollection) : any {
    return this.imagesCollectionService.getIconByImgCollStatus(imgColl);
  }

  getIconByVizVisibility(visibility: boolean) : string {
    return visibility? "pi pi-globe" : "pi pi-user";
  }

}
