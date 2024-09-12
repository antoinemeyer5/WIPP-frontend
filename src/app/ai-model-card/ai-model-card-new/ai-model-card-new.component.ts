import { Component, OnInit } from '@angular/core';

import { AiModelCard } from '../ai-model-card';

import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-ai-model-card-new',
  templateUrl: './ai-model-card-new.component.html',
  styleUrls: ['./ai-model-card-new.component.css']
})

export class AiModelCardNewComponent implements OnInit {

  form: AiModelCard = new AiModelCard();

  list_operation_type: string[] = ['Segmentation', 'Augmentation', 'Other'];

  constructor(private activeModal: DynamicDialogRef) { }

  ngOnInit() {
    
  }

  cancel() {
    this.activeModal.close();
  }

  submit() {
    // todo
  }
  
}
