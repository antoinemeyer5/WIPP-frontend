import { Component, OnInit } from '@angular/core';
import {Workflow} from '../workflow';
import {DialogService, DynamicDialogComponent, DynamicDialogRef} from 'primeng/dynamicdialog';
import {MessageService} from 'primeng/api';
import {WorkflowService} from '../workflow.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-workflow-new',
  templateUrl: './workflow-new.component.html',
  styleUrls: ['./workflow-new.component.css'],
  providers: [MessageService]
})
export class WorkflowNewComponent implements OnInit {

  instance: DynamicDialogComponent | undefined;

  workflow: Workflow = new Workflow();
  isCopy = false;
  sourceWorkflow: Workflow = undefined;

  constructor(public modalReference: DynamicDialogRef,
              private dialogService: DialogService,
              private messageService: MessageService,
              private workflowService: WorkflowService,
              private router: Router) {
    this.instance = this.dialogService.getInstance(this.modalReference);
  }

  ngOnInit() {
    if (this.instance?.data && this.instance?.data['isCopy']) {
      this.isCopy = this.instance.data['isCopy'];
      this.sourceWorkflow = this.instance.data['sourceWorkflow'];
    }
  }

  cancel() {
    this.modalReference.close();
  }

  save() {
    let serviceCall = this.workflowService.createWorkflow(this.workflow);
    if(this.isCopy) {
      serviceCall = this.workflowService.copyWorkflow(this.sourceWorkflow, this.workflow.name);
    }
    serviceCall.subscribe(workflow => {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: "Workflow created. Redirecting..." });
      const workflowId = workflow ? workflow.id : null;
      setTimeout(() => {
        this.router.navigate(['workflows/detail', workflowId]);
      }, 2000);
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Unable to create workflow', detail: error.error });
    });
  }
}
