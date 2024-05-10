import {Component, Input, OnInit} from '@angular/core';
import {ImagesCollection, ImagesCollectionImportMethod} from '../images-collection';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {AppConfigService} from '../../app-config.service';
import {ImagesCollectionService} from '../images-collection.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-images-collection-batch-import',
  templateUrl: './images-collection-batch-import.component.html',
  styleUrls: ['./images-collection-batch-import.component.css']
})
export class ImagesCollectionBatchImportComponent implements OnInit {

  @Input() modalReference: any;
  sourceBackendImport: string;
  name: string;
  description: string;

  displayAlert = false;
  alertMessage = '';
  alertType = 'danger';

  constructor(private activeModal: NgbActiveModal,
              private appConfigService: AppConfigService,
              private imagesCollectionService: ImagesCollectionService,
              private router: Router) {
  }

  ngOnInit() {
  }

  cancel() {
    this.modalReference.dismiss();
  }

  postConfiguration() {
    this.imagesCollectionService.batchImportImagesCollections({
      experimentName: this.name,
      sourceFolder: this.sourceBackendImport,
      description: this.description
    }).subscribe(
      message => {
        console.log(message);
        this.displayAlertMessage('success', 'Success! ' + message['message'] + ' Redirecting...');
        setTimeout(() => {
          this.router.navigate(['images-collections']).then(() => {
              window.location.reload();
          });
        }, 2000);
      },
      err => {
        console.log(err);
        this.displayAlertMessage('danger', 'Could not start import: ' + err.error);
      });
  }

  displayAlertMessage(type, message) {
    this.alertMessage = message;
    this.alertType = type;
    this.displayAlert = true;
  }

}
