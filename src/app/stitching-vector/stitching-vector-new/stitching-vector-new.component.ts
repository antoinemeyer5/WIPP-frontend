import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {StitchingVector} from '../stitching-vector';
import {StitchingVectorService} from '../stitching-vector.service';
import {Router} from '@angular/router';
import {MessageService} from 'primeng/api';
import {DynamicDialogRef} from 'primeng/dynamicdialog';

@Component({
  selector: 'app-stitching-vector-new',
  templateUrl: './stitching-vector-new.component.html',
  styleUrls: ['./stitching-vector-new.component.css'],
  providers: [MessageService]
})
export class StitchingVectorNewComponent implements OnInit {

  stitchingVector: StitchingVector = new StitchingVector();
  fileMaxSizeBytes = 5000000;

  @ViewChild('file') file: ElementRef;

  constructor(public modalReference: DynamicDialogRef,
              private messageService: MessageService,
              private stitchingVectorService: StitchingVectorService,
              private router: Router) {
  }

  ngOnInit() {
  }

  onFileSelected(event) {
    const fileSize = event.target.files[0].size;
    if (fileSize <= this.fileMaxSizeBytes) {
      this.stitchingVector.file = event.target.files[0];
    } else {
      this.messageService.add({ severity: 'error', summary: 'Cannot upload stitching vector.', detail: 'The size of the chosen file is '
          + fileSize +
          ' B . The maximum size allowed is 5MB ( 5 000 000 B)' });
      this.file.nativeElement.value = '';
      this.stitchingVector.file = null;
    }
  }

  upload() {
    this.stitchingVectorService.uploadFile(this.stitchingVector)
      .subscribe(
        stitchingVector => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: "Stitching vector created. Redirecting..." });
          const stitchingVectorId = stitchingVector.id ? stitchingVector.id : null;
          setTimeout(() => {
          this.router.navigate(['stitching-vectors', stitchingVectorId]);
          }, 2000);
        },
        err => {
          this.messageService.add({ severity: 'error', summary: 'Unable to create stitching vector', detail: err.error });
        });
  }

  cancel() {
    this.modalReference.close();
  }
}
