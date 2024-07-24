import { Component, OnInit } from '@angular/core';
import {WorkflowService} from '../workflow.service';
import {Workflow} from '../workflow';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import {WorkflowNewComponent} from '../workflow-new/workflow-new.component';
import {KeycloakService} from '../../services/keycloak/keycloak.service';
import {DialogService} from 'primeng/dynamicdialog';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-workflow-list',
  templateUrl: './workflow-list.component.html',
  styleUrls: ['./workflow-list.component.css'],
  providers: [DialogService, MessageService]
})
export class WorkflowListComponent {
  workflows: Workflow[];
  resultsLength = 0;
  pageSize = 10;

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private workflowService: WorkflowService,
    private keycloakService: KeycloakService,
    private dialogService: DialogService,
    private messageService: MessageService,
  ) {
  }

  loadData(event) {
    const sortOrderStr = event.sortOrder == -1 ? 'desc' : 'asc';
    const sortField = event.sortField ? event.sortField + ',' + sortOrderStr : 'creationDate,desc';
    const params = {
      pageIndex: event.first / event.rows,
      size: event.rows,
      sort: sortField
    };
    if(event.filters?.global?.value) {
      this.workflowService.getWorkflowsByNameContainingIgnoreCase(params, event.filters.global.value).subscribe(result => {
        this.workflows = result.workflows;
        this.resultsLength = result.page.totalElements;
      });
    } else {
      this.workflowService.getWorkflows(params).subscribe(result => {
        this.workflows = result.workflows;
        this.resultsLength = result.page.totalElements;
      });
    }
  }

  createNew() {
    let modalRef = this.dialogService.open(WorkflowNewComponent, {
      header: 'New workflow',
      position: 'top',
      width: '50vw',
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      }
    });
    modalRef.onClose.subscribe((result) => {
      if(result) {
        this.workflowService.createWorkflow(result).subscribe(workflow => {
          const workflowId = workflow ? workflow.id : null;
          this.router.navigate(['workflows/detail', workflowId]);
        }, error => {
          this.messageService.add({ severity: 'error', summary: 'Unable to create workflow', detail: error.error });
        });
      }
    });
  }

  canCreate(): boolean {
    return(this.keycloakService.isLoggedIn());
  }

  getIconByWorkflowStatus(workflow: Workflow) {
    return this.workflowService.getIconByWorkflowStatus(workflow);
  }
}
