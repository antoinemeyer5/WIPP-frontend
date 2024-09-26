import { Component } from '@angular/core';
import {AppConfigService} from '../../app-config.service';
import {ImagesCollectionService} from '../images-collection.service';
import {Router} from '@angular/router';
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-images-collection-batch-import',
  templateUrl: './images-collection-batch-import.component.html',
  styleUrls: ['./images-collection-batch-import.component.css'],
  providers: [MessageService]
})
export class ImagesCollectionBatchImportComponent {

  sourceBackendImport: string;
  name: string;
  description: string;

  constructor(public modalReference: DynamicDialogRef,
              private messageService: MessageService,
              private appConfigService: AppConfigService,
              private imagesCollectionService: ImagesCollectionService,
              private router: Router) {
  }

  cancel() {
    this.modalReference.close();
  }

  postConfiguration() {
    this.imagesCollectionService.batchImportImagesCollections({
      experimentName: this.name,
      sourceFolder: this.sourceBackendImport,
      description: this.description
    }).subscribe(
      message => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: message['message'] + " Redirecting..." });
        setTimeout(() => {
          this.router.navigate(['images-collections']);
        }, 2000);
      },
      err => {
        this.messageService.add({ severity: 'error', summary: 'Could not start import', detail: err.error });
      });
  }
}
