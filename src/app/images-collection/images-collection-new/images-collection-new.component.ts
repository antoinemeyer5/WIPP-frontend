import { Component, OnInit } from '@angular/core';
import {ImagesCollection, ImagesCollectionImportMethod} from '../images-collection';
import {AppConfigService} from '../../app-config.service';
import {DynamicDialogRef} from 'primeng/dynamicdialog';

@Component({
  selector: 'app-images-collection-new',
  templateUrl: './images-collection-new.component.html',
  styleUrls: ['./images-collection-new.component.css']
})
export class ImagesCollectionNewComponent implements OnInit {

  imagesCollection: ImagesCollection = new ImagesCollection();
  usePattern = false;
  ImagesCollectionImportMethod = ImagesCollectionImportMethod;
  displayLocalImportOption = false;

  constructor(public modalReference: DynamicDialogRef, private appConfigService: AppConfigService) {
    if (this.appConfigService.getConfig().displayLocalImportOption) {
      this.displayLocalImportOption = true;
    }
  }

  ngOnInit() {
    this.imagesCollection.importMethod = ImagesCollectionImportMethod.UPLOADED;
  }
  cancel() {
    this.modalReference.close();
  }
  save() {
    this.modalReference.close(this.imagesCollection);
  }

}
