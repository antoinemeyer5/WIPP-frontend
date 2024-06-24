import { Component, OnInit } from '@angular/core';
import { Job } from '../../job/job';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AiModelService } from '../ai-model.service';
import { TensorboardLogs, AiModel } from '../ai-model';
// import { ModelCard } from '../model-card';
import { JobDetailComponent } from '../../job/job-detail/job-detail.component';
import { AppConfigService } from '../../app-config.service';
import urljoin from 'url-join';
import { KeycloakService } from '../../services/keycloak/keycloak.service';

@Component({
  selector: 'app-ai-model-detail',
  templateUrl: './ai-model-detail.component.html',
  styleUrls: ['./ai-model-detail.component.css']
})
export class AiModelDetailComponent implements OnInit {

  AiModel: AiModel = new AiModel();
  tensorboardLogs: TensorboardLogs = null;
  tensorboardLink = '';
  job: Job = null;
  AiModelId = this.route.snapshot.paramMap.get('id');
  // this.modelCard = new ModelCard();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private appConfigService: AppConfigService,
    private AiModelService: AiModelService,
    private keycloakService: KeycloakService) {
  }

  ngOnInit() {
    this.tensorboardLink = urljoin(this.appConfigService.getConfig().tensorboardUrl, '#scalars&regexInput=');
    this.AiModelService.getById(this.AiModelId)
      .subscribe(AiModel => {
        this.AiModel = AiModel;
        this.getTensorboardLogsAndJob();
      }, error => {
        this.router.navigate(['/404']);
      });
    // this.modelCard = service.getModelCardByAiModel(this.AiModel);
  }

  getTensorboardLogsAndJob() {
    if (this.AiModel._links['sourceJob']) {
      this.AiModelService.getJob(this.AiModel._links['sourceJob']['href']).subscribe(job => {
        this.job = job;
        this.AiModelService.getTensorboardLogsByJob(this.job.id).subscribe(res => {
          this.tensorboardLogs = res;
          console.log(this.tensorboardLogs);
          this.tensorboardLink = this.tensorboardLink + this.tensorboardLogs.name;
        });
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
    this.AiModelService.makePublicAiModel(
      this.AiModel).subscribe(AiModel => {
      this.AiModel = AiModel;
    });
  }

  canEdit(): boolean {
    return this.keycloakService.canEdit(this.AiModel);
  }

  openDownload(url: string) {
    this.AiModelService.startDownload(url).subscribe(downloadUrl =>
      window.location.href = downloadUrl['url']);
  }
}
