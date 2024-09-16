import { Component, OnInit } from '@angular/core';

import { AiModelCard } from '../ai-model-card';
import { AiModelCardService } from '../ai-model-card.service';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-ai-model-card-new',
  templateUrl: './ai-model-card-new.component.html',
  styleUrls: ['./ai-model-card-new.component.css']
})
export class AiModelCardNewComponent implements OnInit
{
  form: AiModelCard = new AiModelCard();

  list_operation_type: string[] = ['Segmentation', 'Augmentation', 'Other'];

  train_data: [key: string, val: string] = [null, null];
  train_params: [key: string, val: string] = [null, null];

  constructor( public config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private card_service: AiModelCardService,
    private message_service: MessageService ) { }

  ngOnInit() { this.form.trainingData = this.form.trainingParameters = {}; }

  cancel() { this.ref.close(); }

  // add then reset training form data or parameters
  add_training(type: string, key: string, val: string) {
    if (type == "data") {
      this.form.trainingData[key] = val;
      this.train_data = [null, null];
    } else if (type == "params") {
      this.form.trainingParameters[key] = val;
      this.train_params = [null, null];
    }
  }

  submit() {
    // link model and card
    this.form.aiModelId = this.config.data.modelId;
    // add date and version
    this.form.date = this.form.version = new Date();
    // create card
    this.card_service.postAiModelCard(this.form)
      .subscribe(card => {
        this.message_service.add({ severity: 'success', summary: 'Success',
          detail: card.name + ' card created!' });  
        // close dialog and refresh page
        setTimeout(() => { this.cancel(); window.location.reload(); }, 1000);
      }, err => {
        this.message_service.add({ severity: 'error',
          summary: 'Could not upload AI model card',
          detail: err.error.message });
      });
  }

}
