import { Component, OnInit } from '@angular/core';
import {Job} from '../../job/job';
import {ActivatedRoute, Router} from '@angular/router';
import {JobDetailComponent} from '../../job/job-detail/job-detail.component';
import {Pyramid} from '../pyramid';
import {PyramidService} from '../pyramid.service';
import {KeycloakService} from '../../services/keycloak/keycloak.service';
import {DialogService} from 'primeng/dynamicdialog';

@Component({
  selector: 'app-pyramid-detail',
  templateUrl: './pyramid-detail.component.html',
  styleUrls: ['./pyramid-detail.component.css'],
  providers: [DialogService]
})
export class PyramidDetailComponent implements OnInit {
  pyramid: Pyramid = new Pyramid();
  job: Job = null;
  manifest: any = null;
  pyramidId = this.route.snapshot.paramMap.get('id');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialogService: DialogService,
    private pyramidService: PyramidService,
    private keycloakService: KeycloakService) {
  }

  ngOnInit() {
    this.pyramidService.getById(this.pyramidId)
      .subscribe(pyramid => {
        this.pyramid = pyramid;
        this.getJob();
        this.getManifest(pyramid);
      }, error => {
        this.router.navigate(['/404']);
      });
  }

  getJob() {
    if (this.pyramid._links['job']) {
      this.pyramidService.getJob(this.pyramid._links['job']['href']).subscribe(job => this.job = job);
    }
  }

  getManifest(pyramid: Pyramid) {
    this.pyramidService.getPyramidManifest(pyramid).subscribe(manifest => this.manifest = manifest);
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

  makePublicPyramid(): void {
    this.pyramidService.makePublicPyramid(
      this.pyramid).subscribe(pyramid => {
      this.pyramid = pyramid;
    });
  }

  canEdit(): boolean {
    return this.keycloakService.canEdit(this.pyramid);
  }

  ngOnDestroy() {
    this.dialogService.dialogComponentRefMap.forEach((dialog) => dialog.destroy());
  }

}
