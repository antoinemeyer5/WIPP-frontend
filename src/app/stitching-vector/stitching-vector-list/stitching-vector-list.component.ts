import { Component, OnDestroy, OnInit } from '@angular/core';
import {StitchingVector} from '../stitching-vector';
import {StitchingVectorNewComponent} from '../stitching-vector-new/stitching-vector-new.component';
import {StitchingVectorService} from '../stitching-vector.service';
import {KeycloakService} from '../../services/keycloak/keycloak.service'
import {DialogService} from 'primeng/dynamicdialog';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-stitching-vector-list',
  templateUrl: './stitching-vector-list.component.html',
  styleUrls: ['./stitching-vector-list.component.css'],
  providers: [DialogService, MessageService]
})
export class StitchingVectorListComponent implements OnInit, OnDestroy {
  stitchingVectors: StitchingVector[];

  resultsLength = 0;
  pageSize = 10;

  constructor(
    private stitchingVectorService: StitchingVectorService,
    private dialogService: DialogService,
    private keycloakService: KeycloakService
  ) {
  }

  ngOnInit() {
    this.getStitchingVectors(null);
  }

  getStitchingVectors(event): void {
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
      this.stitchingVectorService.getByNameContainingIgnoreCase(params, event.filters.global.value).subscribe(result => {
        this.stitchingVectors = result.data;
        this.resultsLength = result.page.totalElements;
      });
    } else {
      this.stitchingVectorService.get(params).subscribe(result => {
        this.stitchingVectors = result.data;
        this.resultsLength = result.page.totalElements;
      });
    }
  }

  createNew() {
    this.dialogService.open(StitchingVectorNewComponent, {
      header: 'New stitching vector',
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

  canCreate() : boolean {
    return(this.keycloakService.isLoggedIn());
  }

}
