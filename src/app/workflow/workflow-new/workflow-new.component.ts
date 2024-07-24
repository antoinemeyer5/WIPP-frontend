import { Component, OnInit } from '@angular/core';
import {Workflow} from '../workflow';
import {DynamicDialogRef} from 'primeng/dynamicdialog';

@Component({
  selector: 'app-workflow-new',
  templateUrl: './workflow-new.component.html',
  styleUrls: ['./workflow-new.component.css']
})
export class WorkflowNewComponent {

  workflow: Workflow = new Workflow();
  isCopy = false;

  constructor(public modalReference: DynamicDialogRef) { }

  cancel() {
    this.modalReference.close();
  }

  save() {
    this.modalReference.close(this.workflow);
  }

}
