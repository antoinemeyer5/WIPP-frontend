import { Component } from '@angular/core';
import {Visualization} from '../visualization';
import {MessageService} from 'primeng/api';
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import {Router} from '@angular/router';
import {PyramidVisualizationService} from '../pyramid-visualization.service';

@Component({
  selector: 'app-pyramid-visualization-new',
  templateUrl: './pyramid-visualization-new.component.html',
  styleUrls: ['./pyramid-visualization-new.component.css'],
  providers: [MessageService]
})
export class PyramidVisualizationNewComponent {

  visualization: Visualization = new Visualization();

  constructor(public modalReference: DynamicDialogRef,
              private messageService: MessageService,
              private visualizationService: PyramidVisualizationService,
              private router: Router) {
  }

  save() {
    this.visualizationService.createVisualization(this.visualization).subscribe(
      visualization => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: "Visualization created. Redirecting..." });
        const visualizationId = visualization ? visualization.id : null;
        setTimeout(() => {
          this.router.navigate(['pyramid-visualizations', visualizationId]);
        }, 2000);
      },
      err => {
        this.messageService.add({ severity: 'error', summary: 'Unable to create visualization', detail: err.error });
      });
  }

  cancel() {
    this.modalReference.close();
  }


}
