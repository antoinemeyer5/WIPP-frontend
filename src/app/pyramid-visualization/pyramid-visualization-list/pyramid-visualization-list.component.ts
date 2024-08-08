import {Component} from '@angular/core';
import {Visualization} from '../visualization';
import {Router} from '@angular/router';
import {PyramidVisualizationService} from '../pyramid-visualization.service';
import {PyramidVisualizationNewComponent} from '../pyramid-visualization-new/pyramid-visualization-new.component';
import {KeycloakService} from '../../services/keycloak/keycloak.service'
import {DialogService} from 'primeng/dynamicdialog';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-pyramid-visualization-list',
  templateUrl: './pyramid-visualization-list.component.html',
  styleUrls: ['./pyramid-visualization-list.component.css'],
  providers: [DialogService, MessageService]
})
export class PyramidVisualizationListComponent {

  visualizations: Visualization[];

  resultsLength = 0;
  pageSize = 10;

  constructor(
    private router: Router,
    private visualizationService: PyramidVisualizationService,
    private keycloakService: KeycloakService,
    private dialogService: DialogService
  ) {
  }

  loadData(event) {
    const sortOrderStr = event?.sortOrder == -1 ? 'desc' : 'asc';
    const sortField = event?.sortField ? event.sortField + ',' + sortOrderStr : 'creationDate,desc';
    const pageIndex = event ? event.first / event.rows : 0;
    const pageSize = event ? event.rows : this.pageSize;
    const params = {
      pageIndex: pageIndex,
      size: pageSize,
      sort: sortField
    };
    if(event?.filters?.global?.value) {
      this.visualizationService.getVisualizationsByNameContainingIgnoreCase(params, event.filters.global.value).subscribe(result => {
        this.visualizations = result.data;
        this.resultsLength = result.page.totalElements;
      });
    } else {
      this.visualizationService.getVisualizations(params).subscribe(result => {
        this.visualizations = result.data;
        this.resultsLength = result.page.totalElements;
      });
    }
  }

  createNew() {
    let modalRef = this.dialogService.open(PyramidVisualizationNewComponent, {
      header: 'New visualization',
      position: 'top',
      width: '50vw',
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      }
    });
  }

  canCreate() : boolean {
    return(this.keycloakService.isLoggedIn());
  }

  ngOnDestroy() {
    this.dialogService.dialogComponentRefMap.forEach((dialog) => dialog.destroy());
  }

}
