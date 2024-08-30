import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { FileUpload } from 'primeng/fileupload';
import { AiModel } from '../ai-model';
import { Router } from '@angular/router';
import { AiModelService } from '../ai-model.service';

@Component({
  selector: 'app-ai-model-new',
  templateUrl: './ai-model-new.component.html',
  styleUrls: ['./ai-model-new.component.css'],
  providers: [MessageService]
})
export class AiModelNewComponent implements OnInit {

  newAiModel: AiModel = new AiModel();

  @ViewChild('modelUpload') public modelUpload!: FileUpload;

  constructor(
    private activeModal: DynamicDialogRef,
    private messageService: MessageService,
    private aiModelService: AiModelService,
    private router: Router,
  ) { }

  ngOnInit() { }

  modelUploadCustom(files: any) {
    this.modelUpload.uploading = true;
    this.modelUpload.content = files[0];
  }

  cancel() { this.activeModal.close(); }

  createAiModel() {
    // get upload zip
    this.modelUpload.upload();
    // check upload file
    if (this.modelUpload.content != null) {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form valid' });
      // create new AI model
      this.aiModelService.postAiModel(this.newAiModel).subscribe(
        aimodel => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'AI model created. Redirecting...' });
          const aiModelId = aimodel ? aimodel.id : null;
          setTimeout(() => {
            this.router.navigate(['ai-models', aiModelId]);
            this.cancel();
          }, 2000);
        },
        err => {
          this.messageService.add({ severity: 'error', summary: 'Could not upload AI model', detail: err.error.message });
        }
      );
      // save zip folder
      // TODO
    } else {
      this.messageService.add({ severity: 'error', summary: 'Message', detail: "Form invalid: don't forget to upload a model" });
    }
  }

}
