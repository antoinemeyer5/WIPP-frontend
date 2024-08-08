import { Component, OnDestroy } from '@angular/core';
import {GenericDataService} from '../generic-data.service';
import { GenericData } from '../generic-data';
import {KeycloakService} from '../../services/keycloak/keycloak.service';
import {DialogService} from 'primeng/dynamicdialog';
import {MessageService} from 'primeng/api';
import {GenericDataNewComponent} from '../generic-data-new/generic-data-new.component';

@Component({
  selector: 'app-generic-data-list',
  templateUrl: './generic-data-list.component.html',
  styleUrls: ['./generic-data-list.component.css'],
  providers: [DialogService, MessageService]
})
export class GenericDataListComponent implements OnDestroy{
  genericDatas: GenericData[];

  resultsLength = 0;
  pageSize = 10;

  constructor(
    private genericDataService: GenericDataService,
    private dialogService: DialogService,
    private keycloakService: KeycloakService) {}

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
      this.genericDataService.getByNameContainingIgnoreCase(params, event.filters.global.value).subscribe(result => {
        this.genericDatas = result.data;
        this.resultsLength = result.page.totalElements;
      });
    } else {
      this.genericDataService.get(params).subscribe(result => {
        this.genericDatas = result.data;
        this.resultsLength = result.page.totalElements;
      });
    }
  }

  createNew() {
    this.dialogService.open(GenericDataNewComponent, {
      header: 'New Generic data collection',
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
