import {Component, OnInit} from '@angular/core';
import {Job} from '../../job/job';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AIModelService} from '../ai-model.service';
import {TensorboardLogs, AIModel} from '../ai-model';
import {JobDetailComponent} from '../../job/job-detail/job-detail.component';
import {AppConfigService} from '../../app-config.service';
import urljoin from 'url-join';
import {KeycloakService} from '../../services/keycloak/keycloak.service';

@Component({
  selector: 'app-ai-model-detail',
  templateUrl: './ai-model-detail.component.html',
  styleUrls: ['./ai-model-detail.component.css']
})
export class AIModelDetailComponent implements OnInit {

  aiModel: AIModel = new AIModel();
  tensorboardLogs: TensorboardLogs = null;
  tensorboardLink = '';
  job: Job = null;
  aiModelId = this.route.snapshot.paramMap.get('id');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private appConfigService: AppConfigService,
    private aiModelService: AIModelService,
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
  }

  getTensorboardLogsAndJob() {
    if (this.aiModel._links['sourceJob']) {
      this.aiModelService.getJob(this.aiModel._links['sourceJob']['href']).subscribe(job => {
        this.job = job;
        this.aiModelService.getTensorboardLogsByJob(this.job.id).subscribe(res => {
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
  
  makePublicAIModel(): void {
    this.aiModelService.makePublicAIModel(
      this.aiModel).subscribe(aiModel => {
      this.aiModel = aiModel;
    });
  }

  canEdit(): boolean {
    return this.keycloakService.canEdit(this.aiModel);
  }

  openDownload(url: string) {
    this.aiModelService.startDownload(url).subscribe(downloadUrl =>
      window.location.href = downloadUrl['url']);
  }
}
