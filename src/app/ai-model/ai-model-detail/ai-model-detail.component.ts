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
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-ai-model-detail',
  templateUrl: './ai-model-detail.component.html',
  styleUrls: ['./ai-model-detail.component.css']
})
export class AiModelDetailComponent implements OnInit {

  aiModel: AiModel = new AiModel();
  tensorboardLogs: TensorboardLogs = new TensorboardLogs();
  tensorboardLink = '';
  job: Job = null;
  aiModelId = this.route.snapshot.paramMap.get('id');
  modelCard: ModelCard = new ModelCard();
  aiFramework: string[] = ["TENSORFLOW", "HUGGINGFACE", "BIOIMAGEIO"];
  modalContent: string = '';

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
        document.getElementById(this.modelCard.license).setAttribute("selected", "selected");
      }, error => {
        this.router.navigate(['/404']);
      });
  }

  getTensorboardLogsAndJob() {
    if (this.aiModel._links['sourceJob']) {
      this.aiModelService.getJob(this.aiModel._links['sourceJob']['href']).subscribe(job => {
        this.job = job;
        this.aiModelService.getTensorboardLogsByJob("6682c9e43149955bd95f59a8").subscribe(res => {
          this.tensorboardLogs = res;
          this.tensorboardLink = this.tensorboardLink + this.tensorboardLogs.name;
        });
      });
    }
  }

  displayJobModal(jobId: string) {
    const modalRef = this.modalService.open(JobDetailComponent, { 'size': 'lg' });
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
    var framework = (<HTMLInputElement>document.getElementById("frameworks")).value;
    switch (framework) {
      case this.aiFramework[0]: this.exportModelCard_Tensorflow(id); break;
      case this.aiFramework[1]: this.exportModelCard_Huggingface(id); break;
      case this.aiFramework[2]: this.exportModelCard_Bioimageio(id); break;
      default: alert("TODO export for " + framework);
    }
  }

  exportModelCard_Tensorflow(id: string): void {
    this.aiModelService
      .exportTensorflow(id)
      .subscribe((response: HttpResponse<Blob>) => {
        // get file name
        const contentDisposition = response.headers.get('content-disposition');
        const filename: string = contentDisposition.split('; filename="')[1].split('.json')[0].trim();
        // save
        saveAs(response.body, filename);
      });
  }

  exportModelCard_Huggingface(id: string): void {
    this.aiModelService
      .exportHuggingface(id)
      .subscribe((response: HttpResponse<Blob>) => {
        // get file name
        const contentDisposition = response.headers.get('content-disposition');
        const filename: string = contentDisposition.split('; filename="')[1].trim();
        // save
        saveAs(response.body, filename);
      });
  }

  exportModelCard_Bioimageio(id: string): void {
    this.aiModelService
      .exportBioimageio(id)
      .subscribe((response: HttpResponse<Blob>) => {
        // get file name
        const contentDisposition = response.headers.get('content-disposition');
        const filename: string = contentDisposition.split('; filename="')[1].trim();
        // save
        saveAs(response.body, filename);
      });
  }

  // Preview

  previewModelCard(id: string, showModal: NgTemplateOutlet): void {
    var framework = (<HTMLInputElement>document.getElementById("frameworks")).value;
    switch (framework) {
      // case tensorflow
      case this.aiFramework[0]: {
        // get json
        this.aiModelService
          .exportTensorflow(id)
          .subscribe(async (response: HttpResponse<Blob>) =>
            this.modalContent = await response.body['text']());
        // show modal
        this.modalService.open(showModal, { 'size': 'lg' });
        break;
      }

      // case huggingface
      case this.aiFramework[1]: {
        // get yaml
        this.aiModelService
          .exportHuggingface(id)
          .subscribe(async (response: HttpResponse<Blob>) =>
            this.modalContent = await response.body['text']());
        // show modal
        this.modalService.open(showModal, { 'size': 'lg' });
        break;
      }

      // case bioimageio
      case this.aiFramework[2]: {
        // get yaml
        this.aiModelService
          .exportBioimageio(id)
          .subscribe(async (response: HttpResponse<Blob>) =>
            this.modalContent = await response.body['text']());
        // show modal
        this.modalService.open(showModal, { 'size': 'lg' });
        break;
      }

      default: alert("TODO preview for " + framework); break;
    }
  }

  // Update 

  updateModelCard(value: string, field: string): void {
    if (this.modelCard.hasOwnProperty(field)) {
      this.modelCard[field] = value ? value : "null";
      this.aiModelService.updateModelCard(this.modelCard).subscribe(mc => this.modelCard = mc);
    } else {
      alert("ALERT: can't modify this field.");
    }
  }

}
