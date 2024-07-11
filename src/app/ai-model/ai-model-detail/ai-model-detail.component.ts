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
import { Observable } from 'rxjs';

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

  getHttpFromCurrentFramework(id:string): Observable<HttpResponse<Blob>> {
    // get current framework
    var framework = (<HTMLInputElement>document.getElementById("frameworks")).value;
    // choose
    switch (framework) {
      case this.aiFramework[0]: return this.aiModelService.exportTensorflow(id);
      case this.aiFramework[1]: return this.aiModelService.exportHuggingface(id);
      case this.aiFramework[2]: return this.aiModelService.exportHuggingface(id);
      default:
        alert("ERROR: you can't take any action on this framework.");
        return null;
    }
  }

  exportModelCard(id: string): void {
    // get content
    this.getHttpFromCurrentFramework(id)
    .subscribe((response: HttpResponse<Blob>) => {
      const contentDisposition = response.headers.get('content-disposition');
      // retrieve file name
      const filename: string = contentDisposition.split('; filename="')[1].trim();
      // save file
      saveAs(response.body, filename);
    });
  }

  previewModelCard(id: string, showModal: NgTemplateOutlet): void {
    // get content
    this.getHttpFromCurrentFramework(id)
    .subscribe(async (response: HttpResponse<Blob>) => {
      this.modalContent = await response.body['text']();
    });
    // show
    this.modalService.open(showModal, { 'size': 'lg' });
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
