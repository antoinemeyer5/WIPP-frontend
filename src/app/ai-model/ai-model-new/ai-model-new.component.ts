import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
// primeng
import { MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { FileUpload } from 'primeng/fileupload';
// model
import { AiModel } from '../ai-model';
import { AiModelService } from '../ai-model.service';
// card
import { AiModelCard } from 'src/app/ai-model-card/ai-model-card';
import { AiModelCardService } from 'src/app/ai-model-card/ai-model-card.service';

@Component({
  selector: 'app-ai-model-new',
  templateUrl: './ai-model-new.component.html',
  styleUrls: ['./ai-model-new.component.css'],
  providers: [MessageService]
})
export class AiModelNewComponent implements OnInit {

  formValid: boolean = false;

  newModel: AiModel = new AiModel();
  listModelFramework!: String[];

  newCard: AiModelCard = new AiModelCard();
  listCardOperationType!: String[];
  listCardArchitecture!: String[];

  @ViewChild('modelUpload') public modelUpload!: FileUpload;

  constructor(
    private activeModal: DynamicDialogRef,
    private messageService: MessageService,
    private modelService: AiModelService,
    private cardService: AiModelCardService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.listModelFramework = ['TensorFlow', 'HuggingFace', 'BioImageIO'];
    this.newCard.operationType = [];
    this.listCardOperationType = ['Segmentation', 'Augmentation', 'Other'];
    this.listCardArchitecture = ['U-Net', 'LeNet', 'AlexNet', 'DeepDream'];
  }

  // notes: used when call `this.modelUpload.upload()`
  modelUploadCustom(files: any) {
    this.modelUpload.uploading = true;
    this.modelUpload.content = files[0];
  }

  cancel() { this.activeModal.close(); }

  createModelAndCard() {
    this.modelUpload.upload();

    // check presence of a file
    if (this.modelUpload.content != null) {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form valid' });

      // save model files
      // TODO: call API

      // create new model
      this.modelService.postAiModel(this.newModel)
        .subscribe(model => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'New model uploaded!' });
          const aiModelId = model ? model.id : null;

          // fill-in new card
          this.newCard.aiModelId = aiModelId;
          this.newCard.name = model.name;
          this.newCard.date = model.creationDate;
          this.newCard.framework = model.framework;
          this.newCard.author = model.owner;
          this.newCard.publiclyShared = model.publiclyShared;

          // create new card
          this.cardService.postAiModelCard(this.newCard)
            .subscribe(card => {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'New model card created!' });
              this.messageService.add({ severity: 'info', summary: 'Infos', detail: 'Redirecting...' });

              // redirection to new model
              setTimeout(() => {
                this.router.navigate(['ai-models', aiModelId]);
                this.cancel();
              }, 2000);
            }, err => {
              this.messageService.add({ severity: 'error', summary: 'Could not upload AI model card', detail: err.error.message });
            });
        }, err => {
          this.messageService.add({ severity: 'error', summary: 'Could not upload AI model', detail: err.error.message });
        });
    } else {

      // bad form
      this.messageService.add({ severity: 'error', summary: 'Message', detail: "Form invalid: don't forget to upload a model" });
    }
  }

}
