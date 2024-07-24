import { Component } from '@angular/core';
import {GenericData} from '../generic-data'
import {GenericDataService} from '../generic-data.service'
import {Router} from '@angular/router';
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-generic-data-new',
  templateUrl: './generic-data-new.component.html',
  styleUrls: ['./generic-data-new.component.css'],
  providers: [MessageService]
})
export class GenericDataNewComponent {

  genericData: GenericData = new GenericData();

  constructor(public modalReference: DynamicDialogRef,
              private messageService: MessageService,
              private genericDataService: GenericDataService,
              private router: Router) {
  }

  createCollection() {
    this.genericDataService.createGenericData(this.genericData).subscribe(
      genericData => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: "Collection created. Redirecting..." });
        const genericDataId = genericData ? genericData.id : null;
        setTimeout(() => {
          this.router.navigate(['generic-datas', genericDataId]);
        }, 2000);
      },
      err => {
        this.messageService.add({ severity: 'error', summary: 'Unable to create collection', detail: err.error });
      });
  }

  cancel() {
    this.modalReference.close();
  }
}
