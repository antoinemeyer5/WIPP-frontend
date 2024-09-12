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
export class AiModelCardNewComponent implements OnInit {

  form: AiModelCard = new AiModelCard();

  list_operation_type: string[] = ['Segmentation', 'Augmentation', 'Other'];

  train_data: [key: string, val: string] = [null, null];
  train_params: [key: string, val: string] = [null, null];

  constructor(
    private ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private cardService: AiModelCardService,
    private messageService: MessageService,
  ) {}

  ngOnInit() {
    this.form.trainingData = new Map<string, string>;
    this.form.trainingParameters = new Map<string, string>;
  }

  cancel() { this.ref.close(); }

  add_training(type: string, key: string, val: string) {
    if (type == "data") {
      this.form.trainingData.set(key, val); // add
      this.train_data = [null, null]; // reset
    } else if (type == "params") {
      this.form.trainingParameters.set(key, val); // add
      this.train_params = [null, null]; // reset
    }
  }

  submit() {
    // link model and card
    this.form.aiModelId = this.config.data.modelId;
    // create card
    this.cardService.postAiModelCard(this.form)
      .subscribe(card => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: card.name + ' card created!' });
      }, err => {
        this.messageService.add({ severity: 'error', summary: 'Could not upload AI model card', detail: err.error.message });
      });
  }

}
