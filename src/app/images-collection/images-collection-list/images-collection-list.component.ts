import { Component, NgModule, OnDestroy, OnInit } from '@angular/core';
import {ImagesCollectionService} from '../images-collection.service';
import {ImagesCollection} from '../images-collection';
import {ImagesCollectionNewComponent} from '../images-collection-new/images-collection-new.component';
import {Router} from '@angular/router';
import {KeycloakService} from '../../services/keycloak/keycloak.service'
import {ImagesCollectionBatchImportComponent} from '../images-collection-batch-import/images-collection-batch-import.component';
import {MenuItem, MessageService} from 'primeng/api';
import {DialogService} from 'primeng/dynamicdialog';

@Component({
  selector: 'app-images-collection-list',
  templateUrl: './images-collection-list.component.html',
  styleUrls: ['./images-collection-list.component.css'],
  providers: [DialogService, MessageService]
})
export class ImagesCollectionListComponent implements OnInit, OnDestroy {
  imagesCollections: ImagesCollection[];
  resultsLength = 0;
  pageSize = 10;
  isLoadingResults = true;

  newCollOptions: MenuItem[];

  constructor(
    private imagesCollectionService: ImagesCollectionService,
    private dialogService: DialogService,
    private messageService: MessageService,
    private router: Router,
    private keycloakService: KeycloakService
  ) {
  }

  ngOnInit() {
    this.newCollOptions = [
      {
        label: 'New single images collection',
        icon: 'pi pi-plus',
        command: () => { this.createNew(); }
      },
      {
        label: 'Batch import multiple collections',
        icon: 'pi pi-folder',
        command: () => { this.createBatchImport(); }
      }
    ];
  }

  loadData(event) {
    this.isLoadingResults = true;
    const sortOrderStr = event.sortOrder == -1 ? 'desc' : 'asc';
    const sortField = event.sortField ? event.sortField + ',' + sortOrderStr : 'creationDate,desc';
    const params = {
      pageIndex: event.first / event.rows,
      size: event.rows,
      sort: sortField
    };
    if(event.filters?.global?.value) {
      this.imagesCollectionService.getByNameContainingIgnoreCase(params, event.filters.global.value).subscribe(val => {
        this.imagesCollections = val.data;
        this.isLoadingResults = false;
        this.resultsLength = val.page.totalElements;
      });
    } else {
      this.imagesCollectionService.get(params).subscribe(val => {
        this.imagesCollections = val.data;
        this.isLoadingResults = false;
        this.resultsLength = val.page.totalElements;
      });
    }
  }

  canCreate() : boolean {
    return(this.keycloakService.isLoggedIn());
  }

  createNew() {
    let modalRef = this.dialogService.open(ImagesCollectionNewComponent, {
      header: 'New images collection',
      position: 'top',
      width: '50vw',
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      }
    });
    modalRef.onClose.subscribe((result) => {
      if(result) {
        this.imagesCollectionService.createImagesCollection(result).subscribe(imagesCollection => {
          const imageCollId = imagesCollection ? imagesCollection.id : null;
          this.router.navigate(['images-collection', imageCollId]);
        }, error => {
          this.messageService.add({ severity: 'error', summary: 'Unable to create collection', detail: error.error });
        });
      }
    });
  }

  createBatchImport() {
    this.dialogService.open(ImagesCollectionBatchImportComponent, {
      header: 'Batch import images collections',
      position: 'top',
      width: '50vw',
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      }
    });
  }

  getIconByImgCollStatus(imgColl: ImagesCollection) : any {
    return this.imagesCollectionService.getIconByImgCollStatus(imgColl);
  }

  ngOnDestroy() {
    this.dialogService.dialogComponentRefMap.forEach((dialog) => dialog.destroy());
  }
}
