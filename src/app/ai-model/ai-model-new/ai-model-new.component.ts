import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-ai-model-new',
  templateUrl: './ai-model-new.component.html',
  styleUrls: ['./ai-model-new.component.css'],
  providers: [MessageService]
})
export class AiModelNewComponent implements OnInit {

  constructor(
    private activeModal: DynamicDialogRef,
    private messageService: MessageService,
  ) {
  }

  ngOnInit() { }

  cancel() { this.activeModal.close(); }


}
