import {Component, OnDestroy, OnInit} from '@angular/core';
import {Job} from '../../job/job';
import {ActivatedRoute, Router} from '@angular/router';
import {TensorflowModelService} from '../tensorflow-model.service';
import {TensorboardLogs, TensorflowModel} from '../tensorflow-model';
import {JobDetailComponent} from '../../job/job-detail/job-detail.component';
import {AppConfigService} from '../../app-config.service';
import urljoin from 'url-join';
import {KeycloakService} from '../../services/keycloak/keycloak.service';
import {DialogService} from 'primeng/dynamicdialog';

@Component({
  selector: 'app-tensorflow-model-detail',
  templateUrl: './tensorflow-model-detail.component.html',
  styleUrls: ['./tensorflow-model-detail.component.css'],
  providers: [DialogService]
})
export class TensorflowModelDetailComponent implements OnInit, OnDestroy {

  tensorflowModel: TensorflowModel = new TensorflowModel();
  tensorboardLogs: TensorboardLogs = null;
  tensorboardLink = '';
  job: Job = null;
  tensorflowModelId = this.route.snapshot.paramMap.get('id');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialogService: DialogService,
    private appConfigService: AppConfigService,
    private tensorflowModelService: TensorflowModelService,
    private keycloakService: KeycloakService) {
  }

  ngOnInit() {
    this.tensorboardLink = urljoin(this.appConfigService.getConfig().tensorboardUrl, '#scalars&regexInput=');
    this.tensorflowModelService.getById(this.tensorflowModelId)
      .subscribe(tensorflowModel => {
        this.tensorflowModel = tensorflowModel;
        this.getTensorboardLogsAndJob();
      }, error => {
        this.router.navigate(['/404']);
      });
  }

  getTensorboardLogsAndJob() {
    if (this.tensorflowModel._links['sourceJob']) {
      this.tensorflowModelService.getJob(this.tensorflowModel._links['sourceJob']['href']).subscribe(job => {
        this.job = job;
        this.tensorflowModelService.getTensorboardLogsByJob(this.job.id).subscribe(res => {
          this.tensorboardLogs = res;
          this.tensorboardLink = this.tensorboardLink + this.tensorboardLogs.name;
        });
      });
    }
  }

  displayJobModal(jobId: string) {
    this.dialogService.open(JobDetailComponent, {
      header: 'Job detail',
      position: 'top',
      width: '50vw',
      data: {
        jobId: jobId
      },
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      }
    });
  }

  makePublicTensorflowModel(): void {
    this.tensorflowModelService.makePublicTensorflowModel(
      this.tensorflowModel).subscribe(tensorflowModel => {
      this.tensorflowModel = tensorflowModel;
    });
  }

  canEdit(): boolean {
    return this.keycloakService.canEdit(this.tensorflowModel);
  }

  openDownload(url: string) {
    this.tensorflowModelService.startDownload(url).subscribe(downloadUrl =>
      window.location.href = downloadUrl['url']);
  }

  ngOnDestroy() {
    this.dialogService.dialogComponentRefMap.forEach((dialog) => dialog.destroy());
  }
}
