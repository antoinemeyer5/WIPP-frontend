import { Component } from '@angular/core';
import {CsvCollection} from '../csv-collection';
import {CsvCollectionService} from '../csv-collection.service';
import {Router} from '@angular/router';
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-csv-collection-new',
  templateUrl: './csv-collection-new.component.html',
  styleUrls: ['./csv-collection-new.component.css'],
  providers: [MessageService]
})

export class CsvCollectionNewComponent {

  csvCollection: CsvCollection = new CsvCollection();

  constructor(public modalReference: DynamicDialogRef,
              private messageService: MessageService,
              private csvCollectionService: CsvCollectionService,
              private router: Router) {
  }

  createCollection() {
    this.csvCollectionService.createCsvCollection(this.csvCollection).subscribe(
      csvCollection => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: "Collection created. Redirecting..." });
        const csvCollectionId = csvCollection ? csvCollection.id : null;
        setTimeout(() => {
          this.router.navigate(['csv-collections', csvCollectionId]);
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
