import { AfterViewInit, Component, ElementRef, NgModule, OnInit, ViewChild } from '@angular/core';
import {Job} from '../../job/job';
import {AppConfigService} from '../../app-config.service';
import {ActivatedRoute, Router} from '@angular/router';
import {JobDetailComponent} from '../../job/job-detail/job-detail.component';
import {GenericData} from '../generic-data';
import {GenericFile} from '../generic-file';
import {GenericDataService} from '../generic-data.service';
import {KeycloakService} from '../../services/keycloak/keycloak.service';
import {Subject} from 'rxjs';
import * as Flow from '@flowjs/flow.js';
import {auditTime, map, switchMap} from 'rxjs/operators';
import {DialogService} from 'primeng/dynamicdialog';

@Component({
  selector: 'app-generic-data-detail',
  templateUrl: './generic-data-detail.component.html',
  styleUrls: ['./generic-data-detail.component.css'],
  providers: [DialogService]
})
export class GenericDataDetailComponent implements OnInit, AfterViewInit {

  genericData: GenericData = new GenericData();
  job: Job = null;
  genericDataId = this.route.snapshot.paramMap.get('id');
  uploadOption = 'regular';
  genericFiles: GenericFile[];
  resultsLengthGenericFiles = 0;
  pageSize = 10;

  $throttleRefresh: Subject<void> = new Subject<void>();
  flowHolder: Flow.IFlow;

  @ViewChild('browseBtn') browseBtn: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private elem: ElementRef,
    private dialogService: DialogService,
    private appConfigService: AppConfigService,
    private keycloakService: KeycloakService,
    private genericDataService: GenericDataService) {
  }

  ngOnInit() {
    const self = this;
    this.flowHolder = new Flow({
      uploadMethod: 'POST',
      method: 'octet',
      headers: function(file, chunk, isTest) {
        return {Authorization: `Bearer ${self.keycloakService.getKeycloakAuth().token}`};
      }
    });
    this.$throttleRefresh.pipe(
      auditTime(1000),
      switchMap(() => this.refresh()))
      .subscribe();
  }

  ngAfterViewInit() {
    this.refresh().subscribe(genericData => {
      if (this.canEdit() && !genericData.locked) {
        this.initFlow();
      }
    }, error => {
      this.router.navigate(['/404']);
    });
  }

  refresh() {
    return this.getGenericData().pipe(
      map(genericData => {
        this.genericData = genericData;
        this.getGenericFiles(null);
        if (this.genericData.numberImportingGenericFiles !== 0) {
          this.$throttleRefresh.next();
        }
        this.getJob();
        return genericData;
      }));
  }

  getGenericData() {
    return this.genericDataService.getById(this.genericDataId);
  }

  hasFilesNotComplete(files) {
    return files.some(this.transferNotCompleteFilter);
  }

  transferNotCompleteFilter(flowFile) {
    return !flowFile.isComplete() || flowFile.error;
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

  canEdit(): boolean {
    return this.keycloakService.canEdit(this.genericData);
  }

  getJob() {
    if (this.genericData._links['sourceJob']) {
      this.genericDataService.getJob(this.genericData._links['sourceJob']['href'])
        .subscribe(job => this.job = job);
    }
  }

  makeDataPublic(): void {
    this.genericDataService.makeDataPublic(
      this.genericData).subscribe(genericData => {
      this.genericData = genericData;
    });
  }

  openDownload(url: string) {
    this.genericDataService.startDownload(url).subscribe(downloadUrl =>
      window.location.href = downloadUrl['url']);
  }

  initFlow(): void {
    this.flowHolder.assignBrowse([this.browseBtn.nativeElement], false, false, {'accept': ''});

    const id = '';
    const genericFileUploadUrl = this.genericDataService.getGenericFileUrl(this.genericData);
    this.flowHolder.opts.target = genericFileUploadUrl;

    const self = this;
    this.flowHolder.on('fileAdded', function (file, event) {

      const nbElementsPath = (file.relativePath.match(/\//g) || []).length + 1;

      if (file.name === '.DS_Store' || file.name === 'thumbs.db') {
        return false;
      }

      switch (self.uploadOption) {
        case 'regular': {
          break;
        }
        case 'includeSubsInPath': {
          file.name = file.relativePath.replace(/\//g, '_');
          break;
        }
        case 'ignoreSubs': {
          if (nbElementsPath > 2) {
            return false;
          }
          break;
        }
        default: {
          break;
        }
      }

    });
    this.flowHolder.on('fileSuccess', function (file, message) {
      this.removeFile(file);
      self.$throttleRefresh.next();
    });
    this.flowHolder.on('fileError', function (file, message) {
      file.errorMessage = message;
    });
    this.flowHolder.on('filesSubmitted', function (files, event) {
      this.upload();
    });
  }

  getGenericFiles(event): void {
    const sortField = event?.sortField ? event.sortField : 'fileName,asc';
    const pageIndex = event ? event.first / event.rows : 0;
    const pageSize = event ? event.rows : this.pageSize;
    const params = {
      pageIndex: pageIndex,
      size: pageSize,
      sort: sortField
    };
    this.genericDataService.getGenericFiles(this.genericData, params).subscribe(paginatedResult => {
        this.resultsLengthGenericFiles = paginatedResult.page.totalElements;
        this.genericFiles = paginatedResult.data;
    });
  }

  lockCollection(): void {
    this.genericDataService.lockGenericDataCollection(
      this.genericData).subscribe(genericData => {
      this.genericData = genericData;
    });
  }

  deleteCollection(): void {
    if (confirm('Are you sure you want to delete the collection ' + this.genericData.name + '?')) {
      this.genericDataService.deleteGenericDataCollection(this.genericData).subscribe(collection => {
        this.router.navigate(['generic-datas']);
      });
    }
  }

  deleteGenericFile(genericFile: GenericFile): void {
    this.genericDataService.deleteGenericFile(genericFile).subscribe(result => {
      this.$throttleRefresh.next();
    });
  }

  deleteAllGenericFiles(): void {
    this.genericDataService.deleteAllGenericFiles(this.genericData).subscribe(result => {
      this.$throttleRefresh.next();
    });
  }

  ngOnDestroy() {
    this.dialogService.dialogComponentRefMap.forEach((dialog) => dialog.destroy());
  }
}
