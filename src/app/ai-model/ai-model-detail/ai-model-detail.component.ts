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
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';

interface License {
  id: String;
  name: String;
}

@Component({
  selector: 'app-ai-model-detail',
  templateUrl: './ai-model-detail.component.html',
  styleUrls: ['./ai-model-detail.component.css'],
  providers: [DialogService],
  imports: [FormsModule, DropdownModule]
})
export class AiModelDetailComponent implements OnInit, OnDestroy {
  aiFramework: string[] = ["TENSORFLOW", "HUGGINGFACE", "BIOIMAGEIO",
    "CDCS record"];
  selectedFramework: string | undefined;
  aiModel: AiModel = new AiModel();
  aiModelId = this.route.snapshot.paramMap.get('id');
  aiModelCard: AiModelCard = new AiModelCard();
  tensorboardLogs: TensorboardLogs = new TensorboardLogs();
  tensorboardLink = '';
  tensorboardPlotable: boolean = false;
  job: Job = null;
  licenses: License[] = [
    { id: "Unlicense", name: "Unlicense" },
    { id: "Apache-2.0", name: "Apache-2.0" },
    { id: "GPL", name: "GPL" },
    { id: "MPL-2.0", name: "MPL-2.0" },
    { id: "BSD-3-Clause", name: "BSD-3-Clause" }
  ];
  selectedLicense: License | undefined;

  chartdata_accu: { labels: string[], datasets: any[] };
  chartdata_loss: { labels: string[], datasets: any[] };

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
    this.selectedLicense = this.licenses[0]; // by default
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
        this.selectedLicense = { id: this.aiModelCard.license, name: this.aiModelCard.license };
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
          .getTensorboardLogsByJob(this.job.id)
          .subscribe(res => {
            this.tensorboardLogs = res;
            this.tensorboardLink = this.tensorboardLink + this.tensorboardLogs.name;
            this.tensorboardPlotable = true;
            this.chartdata_accu = this.loadChart("accuracy");
            this.chartdata_loss = this.loadChart("loss");
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

  loadChart(tag: string) {
    let tensorboard_id = this.tensorboardLogs.id;
    let labels: string[] = [];
    let test = { label: 'test', data: [] };
    this.aiModelService
      .getTensorboardlogsCSV(tensorboard_id, "test", tag)
      .subscribe(data => {
        // remove headers; get epochs and values
        for (let v of data.slice(1)) {
          labels.push(v[1]);
          test.data.push(v[2]);
        }
      });

    let train = { label: 'train', data: [] };
    this.aiModelService
      .getTensorboardlogsCSV(tensorboard_id, "train", tag) // todo
      .subscribe(data => {
        for (let v of data.slice(1)) {
          train.data.push(v[2]);
        }
      });

    let chartdata = { labels: labels, datasets: [test, train] };
    return chartdata;
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

  getHttpFromCurrentFramework(id: string): Observable<HttpResponse<Blob>> {
    switch (this.selectedFramework) {
      case "TENSORFLOW": return this.aiModelCardService.exportTensorflow(id);
      case "HUGGINGFACE": return this.aiModelCardService.exportHuggingface(id);
      case "BIOIMAGEIO": return this.aiModelCardService.exportBioimageio(id);
      case "CDCS record": return this.aiModelCardService.exportCDCS(id);
      default:
        alert("ERROR: you can't take any action on this framework.");
        return null;
    }
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

  /*uploadAiModelCardInCDCS(id: string): void {
    this.aiModelCardService.uploadCDCS(id).subscribe({
      next: data => {
        console.log("Uploaded this: " + data);
      },
      error: error => {
        console.error('There was an error!', error.message);
      }
    });
  }*/

  /***** Keycloak Methods *****/

  canEdit(): boolean {
    return this.keycloakService.canEdit(this.aiModel);
  }

}
