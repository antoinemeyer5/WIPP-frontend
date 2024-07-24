import { Component, OnDestroy, OnInit } from '@angular/core';
import { Job } from '../../job/job';
import { ActivatedRoute, Router } from '@angular/router';
import { AiModelService } from '../ai-model.service';
import { TensorboardLogs, AiModel } from '../ai-model';
import { JobDetailComponent } from '../../job/job-detail/job-detail.component';
import { AppConfigService } from '../../app-config.service';
import urljoin from 'url-join';
import { KeycloakService } from '../../services/keycloak/keycloak.service';
import { DialogService } from 'primeng/dynamicdialog';

import { AiModelCard } from '../../ai-model-card/ai-model-card';
import { AiModelCardDetailComponent } from 'src/app/ai-model-card/ai-model-card-detail/ai-model-card-detail.component'
import { AiModelCardService } from 'src/app/ai-model-card/ai-model-card.service';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-ai-model-detail',
  templateUrl: './ai-model-detail.component.html',
  styleUrls: ['./ai-model-detail.component.css'],
  providers: [DialogService]
})
export class AiModelDetailComponent implements OnInit, OnDestroy {
  aiFramework: string[] = ["TENSORFLOW", "HUGGINGFACE", "BIOIMAGEIO", "PYTORCH"];
  aiModel: AiModel = new AiModel();
  aiModelId = this.route.snapshot.paramMap.get('id');
  aiModelCard: AiModelCard = new AiModelCard();
  tensorboardLogs: TensorboardLogs = new TensorboardLogs();
  tensorboardLink = '';
  tensorboardPlotable: boolean = false;
  job: Job = null;

  chartdata_accu: any;
  chartdata_loss: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialogService: DialogService,
    private appConfigService: AppConfigService,
    private aiModelService: AiModelService,
    private aiModelCardService: AiModelCardService,
    private keycloakService: KeycloakService
  ) { }

  /***** NgOn Methods *****/

  ngOnInit() {
    this.tensorboardLink = urljoin(this.appConfigService.getConfig().tensorboardUrl, '#scalars&regexInput=');
    this.aiModelService.getById(this.aiModelId)
      .subscribe(aiModel => {
        this.aiModel = aiModel;
        this.getTensorboardLogsAndJob();
      }, error => {
        this.router.navigate(['/404']);
      });
    // loads the AI ModelCard associated with the model
    this.aiModelCardService.getAiModelCard(this.aiModelId)
      .subscribe(aiModelCard => {
        this.aiModelCard = aiModelCard;
        document.getElementById(this.aiModelCard.license).setAttribute("selected", "selected");
      }, error => {
        this.router.navigate(['/404']);
      });
  }

  ngOnDestroy() {
    this.dialogService.dialogComponentRefMap.forEach((dialog) => dialog.destroy());
  }

  /***** TensorBoard Methods *****/

  getTensorboardLogsAndJob() {
    if (this.aiModel._links['sourceJob']) {
      this.aiModelService.getJob(this.aiModel._links['sourceJob']['href']).subscribe(job => {
        this.job = job;
        this.aiModelService
          .getTensorboardLogsByJob("6682c9e43149955bd95f59a8")  // todo: use `this.job.id`, 6682c9e43149955bd95f59a8
          .subscribe(res => {
            this.tensorboardLogs = res;
            this.tensorboardLink = this.tensorboardLink + this.tensorboardLogs.name;
            this.tensorboardPlotable = true;
            this.accuChart();
            this.lossChart();
          });
      });
    }
  }

  displayJobModal(jobId: string) {
    this.dialogService.open(JobDetailComponent, {
      header: 'Job detail',
      position: 'top',
      width: '50vw',
      data: { jobId: jobId },
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      }
    });
  }

  lossChart() {
    let chartdata_loss_labels: string[] = [];
    let chartdata_loss_TEST = { label: 'test', data: [] };
    let chartdata_loss_TRAIN = { label: 'train', data: [] };

    this.chartdata_loss = {
      labels: chartdata_loss_labels,
      datasets: [chartdata_loss_TEST, chartdata_loss_TRAIN]
    };

    this.aiModelService
      .getTensorboardlogsCSV("6682f3d43149955bd95f59ab", "test", "loss") // todo: use `this.tensorboardLogs.id`, "6682c9e43149955bd95f59a8"
      .subscribe(data => {
        for (let v of data.slice(1)) { // remove headers
          chartdata_loss_labels.push(v[1]); // epoch
          chartdata_loss_TEST.data.push(v[2]); //values
        }
      });
    this.aiModelService
      .getTensorboardlogsCSV("6682f3d43149955bd95f59ab", "train", "loss")
      .subscribe(data => {
        for (let v of data.slice(1)) { // remove headers
          chartdata_loss_TRAIN.data.push(v[2]); //values
        }
      });
  }

  accuChart() {
    let chartdata_accu_labels: string[] = [];
    let chartdata_accu_TEST = { label: 'test', data: [] };
    let chartdata_accu_TRAIN = { label: 'train', data: [] };

    this.chartdata_accu = {
      labels: chartdata_accu_labels,
      datasets: [chartdata_accu_TEST, chartdata_accu_TRAIN]
    };

    this.aiModelService
      .getTensorboardlogsCSV("6682f3d43149955bd95f59ab", "test", "accuracy") // todo: use `this.tensorboardLogs.id`, "6682c9e43149955bd95f59a8"
      .subscribe(data => {
        for (let v of data.slice(1)) { // remove headers
          chartdata_accu_labels.push(v[1]); // epoch
          chartdata_accu_TEST.data.push(v[2]); //values
        }
      });
    this.aiModelService
      .getTensorboardlogsCSV("6682f3d43149955bd95f59ab", "train", "accuracy")
      .subscribe(data => {
        for (let v of data.slice(1)) { // remove headers
          chartdata_accu_TRAIN.data.push(v[2]); //values
        }
      });
  }

  /***** AiModel Methods *****/

  makePublicAiModel(): void {
    this.aiModelService
      .makePublicAiModel(this.aiModel)
      .subscribe(aiModel => { this.aiModel = aiModel; });
  }

  openDownload(url: string) {
    this.aiModelService
      .startDownload(url)
      .subscribe(downloadUrl => window.location.href = downloadUrl['url']);
  }

  displayAiModelCardModal(aiModelId: string) {
    // get
    this.getHttpFromCurrentFramework(aiModelId)
      .subscribe(async (response: HttpResponse<Blob>) => {
        let content: string = await response.body['text']();
        // display
        this.dialogService.open(AiModelCardDetailComponent, {
          header: 'Preview',
          position: 'top',
          width: '50vw',
          data: {
            aiModelId: aiModelId,
            content: content
          },
          breakpoints: {
            '960px': '75vw',
            '640px': '90vw'
          }
        });
      });
  }

  getHttpFromCurrentFramework(id: string): Observable<HttpResponse<Blob>> {
    // get current framework
    var framework = (<HTMLInputElement>document.getElementById("frameworks")).value;
    // choose
    switch (framework) {
      case "TENSORFLOW": return this.aiModelCardService.exportTensorflow(id);
      case "HUGGINGFACE": return this.aiModelCardService.exportHuggingface(id);
      case "BIOIMAGEIO": return this.aiModelCardService.exportBioimageio(id);
      default:
        alert("ERROR: you can't take any action on this framework.");
        return null;
    }
  }

  exportAiModelCard(id: string): void {
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

  updateAiModelCard(value: string, field: string): void {
    if (this.aiModelCard.hasOwnProperty(field)) {
      this.aiModelCard[field] = value ? value : "null";
      this.aiModelCardService.updateAiModelCard(this.aiModelCard).subscribe(mc => this.aiModelCard = mc);
    } else {
      alert("ALERT: can't modify this field.");
    }
  }

  /***** Keycloak Methods *****/

  canEdit(): boolean {
    return this.keycloakService.canEdit(this.aiModel);
  }

}
