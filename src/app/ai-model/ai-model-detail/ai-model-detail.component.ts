import { Component, OnInit } from '@angular/core';
import { Job } from '../../job/job';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AiModelService } from '../ai-model.service';
import { TensorboardLogs, AiModel } from '../ai-model';
import { ModelCard } from '../model-card';
import { JobDetailComponent } from '../../job/job-detail/job-detail.component';
import { AppConfigService } from '../../app-config.service';
import urljoin from 'url-join';
import { KeycloakService } from '../../services/keycloak/keycloak.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-ai-model-detail',
  templateUrl: './ai-model-detail.component.html',
  styleUrls: ['./ai-model-detail.component.css']
})
export class AiModelDetailComponent implements OnInit {

  aiModel: AiModel = new AiModel();
  tensorboardLogs: TensorboardLogs = null;
  tensorboardLink = '';
  job: Job = null;
  aiModelId = this.route.snapshot.paramMap.get('id');
  modelCard: ModelCard = new ModelCard();
  aiFramework: string[] = ["TENSORFLOW", "HUGGINGFACE", "BIOIMAGEIO"];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private appConfigService: AppConfigService,
    private aiModelService: AiModelService,
    private keycloakService: KeycloakService) {
  }

  ngOnInit() {
    this.tensorboardLink = urljoin(this.appConfigService.getConfig().tensorboardUrl, '#scalars&regexInput=');
    this.aiModelService.getById(this.aiModelId)
      .subscribe(aiModel => {
        this.aiModel = aiModel;
        this.getTensorboardLogsAndJob();
      }, error => {
        this.router.navigate(['/404']);
      });
    // loads the ModelCard associated with the model
    this.aiModelService.getModelCard(this.aiModelId)
      .subscribe(modelCard => {
        this.modelCard = modelCard;
      }, error => {
        this.router.navigate(['/404']);
      });
  }

  getTensorboardLogsAndJob() {
    if (this.aiModel._links['sourceJob']) {
      this.aiModelService.getJob(this.aiModel._links['sourceJob']['href']).subscribe(job => {
        this.job = job;
        /*
        this.aiModelService.getTensorboardLogsByJob(this.job.id).subscribe(res => {
          this.tensorboardLogs = res;
          console.log(this.tensorboardLogs);
          this.tensorboardLink = this.tensorboardLink + this.tensorboardLogs.name;
        });
        */
      });
    }
  }

  displayJobModal(jobId: string) {
    const modalRef = this.modalService.open(JobDetailComponent, {'size': 'lg'});
    modalRef.componentInstance.modalReference = modalRef;
    (modalRef.componentInstance as JobDetailComponent).jobId = jobId;
    modalRef.result.then((result) => {
      }
      , (reason) => {
        console.log('dismissed');
      });
  }
  
  makePublicAiModel(): void {
    this.aiModelService
      .makePublicAiModel(this.aiModel)
      .subscribe(aiModel => { this.aiModel = aiModel; });
  }

  canEdit(): boolean {
    return this.keycloakService.canEdit(this.aiModel);
  }

  openDownload(url: string) {
    this.aiModelService
      .startDownload(url)
      .subscribe(downloadUrl => window.location.href = downloadUrl['url']);
  }

  /***** Model Card Methods *****/

  // Export

  exportModelCard(id: string): void {
    var platform = (<HTMLInputElement>document.getElementById("platforms")).value;
    switch(platform) {
      case this.aiFramework[0]: this.exportModelCardTensorflow(id); break;
      default: alert("todo export: " + platform);
    }
  }

  exportModelCardTensorflow(id: string): void {
    this.aiModelService
      .downloadTensorflow(id)
      .subscribe((response: HttpResponse<Blob>) => {
        // get file name
        const contentDisposition = response.headers.get('content-disposition');
        const filename: string = contentDisposition.split('; filename="')[1].split('.json')[0].trim();
        // save
        saveAs(response.body, filename);
      });
  }

  // Preview

  previewModelCard(showModelcardModal: any): void {
    var platform = (<HTMLInputElement>document.getElementById("platforms")).value;
    switch(platform) {
      case this.aiFramework[0]: this.modalService.open(showModelcardModal, {'size': 'lg'}); break;
      default: alert("todo preview: " + platform); break;
    }
  }

  // Update 

  updateModelCard(value: string, field: string): void {
    if(this.modelCard.hasOwnProperty(field)) {
      this.modelCard[field] = value ? value : "null";
      this.aiModelService.updateModelCard(this.modelCard).subscribe(mc => this.modelCard = mc);
    } else {
      alert("ALERT: can't modify this field.");
    }
  }

}
