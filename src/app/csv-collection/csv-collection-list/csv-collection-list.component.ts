import { Component, OnDestroy } from '@angular/core';
import {CsvCollection} from '../csv-collection';
import {CsvCollectionService} from '../csv-collection.service';
import {CsvCollectionNewComponent} from '../csv-collection-new/csv-collection-new.component';
import {Router} from '@angular/router';
import {KeycloakService} from '../../services/keycloak/keycloak.service';
import {DialogService} from 'primeng/dynamicdialog';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-csv-collection-list',
  templateUrl: './csv-collection-list.component.html',
  styleUrls: ['./csv-collection-list.component.css'],
  providers: [DialogService, MessageService]
})
export class CsvCollectionListComponent implements OnDestroy {
  csvCollections: CsvCollection[];

  resultsLength = 0;
  pageSize = 10;

  constructor(
    private csvCollectionService: CsvCollectionService,
    private router: Router,
    private keycloakService: KeycloakService,
    private dialogService: DialogService
  ) {}

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
      this.csvCollectionService.getByNameContainingIgnoreCase(params, event.filters.global.value).subscribe(result => {
        this.csvCollections = result.data;
        this.resultsLength = result.page.totalElements;
      });
    } else {
      this.csvCollectionService.get(params).subscribe(result => {
        this.csvCollections = result.data;
        this.resultsLength = result.page.totalElements;
      });
    }
  }

  createNew() {
    let modalRef = this.dialogService.open(CsvCollectionNewComponent, {
      header: 'New CSV collection',
      position: 'top',
      width: '50vw',
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      }
    });
  }

  ngOnDestroy() {
    this.dialogService.dialogComponentRefMap.forEach((dialog) => dialog.destroy());
  }

  canCreate(): boolean {
    return(this.keycloakService.isLoggedIn());
  }

}
