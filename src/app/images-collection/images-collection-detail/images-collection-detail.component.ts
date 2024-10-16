import { AfterViewInit, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {auditTime, catchError, map, switchMap} from 'rxjs/operators';
import * as Flow from '@flowjs/flow.js';
import {ImagesCollectionService} from '../images-collection.service';
import {ImagesCollection} from '../images-collection';
import {Image} from '../image';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {BehaviorSubject, from, Observable, of as observableOf, Subject} from 'rxjs';
import {MetadataFile} from '../metadata-file';
import {JobDetailComponent} from '../../job/job-detail/job-detail.component';
import {Job} from '../../job/job';
import urljoin from 'url-join';
import {AppConfigService} from '../../app-config.service';
import {KeycloakService} from '../../services/keycloak/keycloak.service';
import {ConfirmDialogService} from '../../confirm-dialog/confirm-dialog.service';
import OpenSeadragon from 'openseadragon';
import {MessageService, SelectItem} from 'primeng/api';
import {environment} from '../../../environments/environment';
import {DialogService} from 'primeng/dynamicdialog';

@Component({
  selector: 'app-images-collection-detail',
  templateUrl: './images-collection-detail.component.html',
  styleUrls: ['./images-collection-detail.component.css'],
  providers: [DialogService, MessageService]
})
export class ImagesCollectionDetailComponent implements OnInit, AfterViewInit {

  flowHolder: Flow.IFlow;
  imagesCollection: ImagesCollection = new ImagesCollection();
  images: Observable<Image[]>;
  imagesTest: Image[];
  metadataFiles: Observable<MetadataFile[]>;
  metadataFiles2: MetadataFile[];
  sourceJob: Job = null;
  showNotes = true;
  editNotes = false;
  imageCollectionNotes;

  displayedColumnsImages: string[] = ['index', 'thumbnail', 'fileName', 'fileSize', 'actions'];
  displayedColumnsMetadata: string[] = ['index', 'fileName', 'fileSize', 'actions'];

  layout: string = 'grid';

  sortOptions: SelectItem[];
  sortField: string;

  colorMapOptions: SelectItem[];
  colorMapField: string;

  contrastOptions: SelectItem[];
  contrastField: string;

  invertOptions: SelectItem[];
  invertField: string;

  pageSizeOptions: number[] = [10, 25, 50, 100];
  imagesParamsChange: BehaviorSubject<{ index: number, size: number, sort: string }>;
  metadataParamsChange: BehaviorSubject<{ index: number, size: number, sort: string }>;

  uploadOption = 'regular';
  resultsLengthImages = 0;
  resultsLengthMetadataFiles = 0;
  pageSizeImages = 10;
  pageSizeMetadataFiles = 10;
  goToPageImages;
  goToPageMetadataFiles;
  imageCollectionId = this.route.snapshot.paramMap.get('id');
  sourceCatalogLink = '';

  iipRootUrl: string = environment.iipRootUrl;
  dzvVisible: boolean = false;
  selectedImage: Image = undefined;
  osdViewer: OpenSeadragon.Viewer | undefined;

  @ViewChild('browseBtn') browseBtn: ElementRef;
  @ViewChild('browseDirBtn') browseDirBtn: ElementRef;
  @ViewChild('dropArea') dropArea: ElementRef;
  @ViewChild('imagesPaginator') imagesPaginator: MatPaginator;
  @ViewChild('imagesSort') sort: MatSort;
  @ViewChild('metadataFilesPaginator') metadataFilesPaginator: MatPaginator;
  @ViewChild('metadataFilesSort') metadataFilesSort: MatSort;

  $throttleRefresh: Subject<void> = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private elem: ElementRef,
    private dialogService: DialogService,
    private messageService: MessageService,
    private imagesCollectionService: ImagesCollectionService,
    private appConfigService: AppConfigService,
    private keycloakService: KeycloakService,
    private confirmDialogService: ConfirmDialogService,
    private ngZone: NgZone
    ) {
    this.imagesParamsChange = new BehaviorSubject({
      index: 0,
      size: this.pageSizeImages,
      sort: ''
    });
    this.metadataParamsChange = new BehaviorSubject({
      index: 0,
      size: this.pageSizeMetadataFiles,
      sort: ''
    });
  }

  canEdit(): boolean {
    return this.keycloakService.canEdit(this.imagesCollection);
  }

  canDeletePublicData(): boolean {
    return this.keycloakService.canDeletePublicData();
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
    this.sortOptions = [
      { label: 'Name (asc)', value: 'fileName,asc' },
      { label: 'Name (desc)', value: 'fileName,desc' },
      { label: 'Size (asc)', value: 'fileSize,asc' },
      { label: 'Size (desc)', value: 'fileSize,desc' }
    ];
    this.colorMapOptions = [
      { label: 'NONE', value: '' },
      { label: 'GREY', value: 'GREY' },
      { label: 'JET', value: 'JET' },
      { label: 'COLD', value: 'COLD' },
      { label: 'HOT', value: 'HOT' },
      { label: 'RED', value: 'RED' },
      { label: 'GREEN', value: 'GREEN' },
      { label: 'BLUE', value: 'BLUE' }
    ];
    this.contrastOptions = [
      { label: 'NONE', value: '1' },
      { label: 'STRETCH', value: 'ST' },
      { label: 'EQUALIZATION', value: 'EQ' },
      { label: 'x2', value: '2' },
      { label: 'x10', value: '10' },
      { label: 'x100', value: '100' }
    ];
    this.invertOptions = [
      { label: 'NO', value: '' },
      { label: 'YES', value: '&INV' }
    ];
    this.$throttleRefresh.pipe(
      auditTime(1000),
      switchMap(() => this.refresh()))
      .subscribe();
  }

  ngAfterViewInit() {
    // fixme: temporary fix while waiting for 1.0.0 release of ngx-inline-editor
    const faRemoveElt = this.elem.nativeElement.querySelector('.fa-remove');
    if (faRemoveElt != null) { // this element can be null, if the user can not edit the collection
      faRemoveElt.classList.remove('fa-remove');
      faRemoveElt.classList.add('fa-times');
    }

    this.refresh().subscribe(imagesCollection => {
      if (this.canEdit() && !imagesCollection.locked) {
        this.initFlow();
      }
    }, error => {
      this.router.navigate(['/404']);
    });
  }

  refresh() {
    return this.getImagesCollection().pipe(
      map(imagesCollection => {
        this.imagesCollection = imagesCollection;
        if (this.imagesCollection.sourceCatalog) {
          this.sourceCatalogLink = urljoin(this.appConfigService.getConfig().catalogUiUrl, this.imagesCollection.sourceCatalog);
        }
        this.imageCollectionNotes = this.imagesCollection.notes;
        this.getImages();
        this.getMetadataFiles();
        const params = {
          pageIndex: 0,
          size: 10,
          sort: "fileName,asc"
        };
        this.imagesCollectionService.getImages(this.imagesCollection, params).subscribe(val => {
          this.resultsLengthImages = val.page.totalElements;
          this.imagesTest = val.data;
        });
        this.imagesCollectionService.getMetadataFiles(this.imagesCollection, params).subscribe(val => {
          this.resultsLengthMetadataFiles = val.page.totalElements;
          this.metadataFiles2 = val.data;
        });
        if (this.imagesCollection.numberImportingImages !== 0) {
          this.$throttleRefresh.next();
        }
        this.getSourceJob();
        return imagesCollection;
      }));
  }

  getImagesCollection() {
    return this.imagesCollectionService.getById(this.imageCollectionId);
  }

  getImages(): void {
    const paramsObservable = this.imagesParamsChange.asObservable();
    this.images = paramsObservable.pipe(
      switchMap((page) => {
        const params = {
          pageIndex: page.index,
          size: page.size,
          sort: page.sort
        };
        return this.imagesCollectionService.getImages(this.imagesCollection, params).pipe(
          map((paginatedResult) => {
            this.resultsLengthImages = paginatedResult.page.totalElements;
            return paginatedResult.data;
          }),
          catchError(() => {
            return observableOf([]);
          })
        );
      })
    );
  }

  getMetadataFiles(): void {
    const metadataParamsObservable = this.metadataParamsChange.asObservable();
    this.metadataFiles = metadataParamsObservable.pipe(
      switchMap((page) => {
        const metadataParams = {
          pageIndex: page.index,
          size: page.size,
          sort: page.sort
        };
        return this.imagesCollectionService.getMetadataFiles(this.imagesCollection, metadataParams).pipe(
          map((paginatedResult) => {
            this.resultsLengthMetadataFiles = paginatedResult.page.totalElements;
            this.metadataFiles2 = paginatedResult.data;
            return paginatedResult.data;
          }),
          catchError(() => {
            return observableOf([]);
          })
        );
      })
    );
  }

  getNbFiles(): number {
    const imagesCollection = this.imagesCollection;
    if (!imagesCollection) {
      return 0;
    }
    return imagesCollection.numberOfImages +
      imagesCollection.numberOfMetadataFiles;
  }

  updateCollectionName(name: string): void {
    this.imagesCollectionService.setImagesCollectionName(
      this.imagesCollection, name).subscribe(imagesCollection => {
      this.imagesCollection = imagesCollection;
    });
  }

  updateCollectionNotes(notes: string): void {
    this.imagesCollectionService.setImagesCollectionNotes(
      this.imagesCollection, notes).subscribe(imagesCollection => {
      this.imagesCollection = imagesCollection;
    });
  }

  makePublicCollection(): void {
    const title = 'Make public';
    const message = 'Are you sure you want to make this collection public? ' +
      'This action cannot be undone.';
    const warnings: string[] = [];
    warnings.push('Once public, all users will be able to see and use the collection.');
    warnings.push('Once public, the collection cannot be deleted except by an admin user.');
    const modalRefConfirm = this.confirmDialogService.createConfirmModal(
      title, message, warnings
    );
    modalRefConfirm.onClose.subscribe((confirm) => {
      if (confirm) {
        this.imagesCollectionService.makePublicImagesCollection(
          this.imagesCollection).subscribe(imagesCollection => {
          this.imagesCollection = imagesCollection;
        }, error => {
          this.messageService.add({ severity: 'error', summary: 'Unable to make collection public', detail: error.error });
        });
      }
    });
  }

  lockCollection(): void {
    this.imagesCollectionService.lockImagesCollection(
      this.imagesCollection).subscribe(imagesCollection => {
      this.imagesCollection = imagesCollection;
    });
  }

  deleteCollection(): void {
    const title = 'Delete collection';
    const message = 'Are you sure you want to delete the collection ' +
      this.imagesCollection.name + '? ' +
      'This action cannot be undone.';
    const warnings: string[] = [];
    if (this.imagesCollection.locked) {
      warnings.push('This collection is locked.');
    }
    if (this.imagesCollection.publiclyShared) {
      warnings.push('This collection is public, multiple users may be impacted.');
    }
    const modalRefConfirm = this.confirmDialogService.createConfirmModal(
      title, message, warnings
    );
    modalRefConfirm.onClose.subscribe((confirm) => {
      if (confirm) {
        this.imagesCollectionService.deleteImagesCollection(this.imagesCollection).subscribe(collection => {
          this.router.navigate(['images-collections']);
        });
      }
    });
  }

  deleteImage(image: Image): void {
    this.imagesCollectionService.deleteImage(image).subscribe(result => {
      this.$throttleRefresh.next();
    });
  }

  deleteMetadataFile(metadataFile: MetadataFile): void {
    this.imagesCollectionService.deleteMetadataFile(metadataFile).subscribe(result => {
      this.$throttleRefresh.next();
    });
  }

  deleteAllImages(): void {
    this.imagesCollectionService.deleteAllImages(this.imagesCollection).subscribe(result => {
      this.$throttleRefresh.next();
    });
  }

  deleteAllMetadataFiles(): void {
    this.imagesCollectionService.deleteAllMetadataFiles(this.imagesCollection).subscribe(result => {
      this.$throttleRefresh.next();
    });
  }

  getPattern(): string {
    const imagesCollection = this.imagesCollection;
    if (!imagesCollection.pattern) {
      return 'Null';
    }
    return imagesCollection.pattern;
  }

  initFlow(): void {

    this.flowHolder.assignBrowse([this.browseBtn.nativeElement], false, false);
    this.flowHolder.assignBrowse([this.browseDirBtn.nativeElement], true, false);
    this.flowHolder.assignDrop(this.dropArea.nativeElement);

    const id = this.route.snapshot.paramMap.get('id');
    const imagesUploadUrl = this.imagesCollectionService.getImagesUrl(this.imagesCollection);
    const metadataFilesUploadUrl = this.imagesCollectionService.getMetadataFilesUrl(this.imagesCollection);

    this.flowHolder.opts.target = function (file) {
      const imagesExtensions = ['tif', 'tiff', 'jpg', 'jpeg', 'png', 'mrc', 'dm4', 'svs'];
      const isImage = imagesExtensions.indexOf(
        file.getExtension()) >= 0;
      return isImage ? imagesUploadUrl : metadataFilesUploadUrl;
    };

    const self = this;
    this.flowHolder.on('fileAdded', function (file, event) {
      console.log('Added');
      console.log(file, event);

      const nbElementsPath = (file.relativePath.match(/\//g) || []).length + 1;

      console.log('file.name: ' + file.name);
      if (file.name === '.DS_Store' || file.name === 'thumbs.db') {
        return false;
      }

      switch (self.uploadOption) {
        case 'regular': {
          console.log('Upload option selected : regular');
          break;
        }
        case 'includeSubsInPath': {
          console.log('Upload option selected : includeSubsInPath');
          file.name = file.relativePath.replace(/\//g, '_');
          break;
        }
        case 'ignoreSubs': {
          console.log('Upload option selected : ignoreSubs');
          if (nbElementsPath > 2) {
            console.log('must be ignored');
            return false;
          }
          break;
        }
        default: {
          console.log('default upload option is regular');
          break;
        }
      }

    });
    this.flowHolder.on('fileSuccess', function (file, message) {
      this.removeFile(file);
      self.$throttleRefresh.next();
    });
    this.flowHolder.on('fileError', function (file, message) {
      console.log('Error');
      console.log(file, message);
      file.errorMessage = message;
    });
    this.flowHolder.on('filesSubmitted', function (files, event) {
      this.upload();
    });
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

  getSourceJob() {
    this.imagesCollectionService.getSourceJob(this.imagesCollection).subscribe(job => {
      this.sourceJob = job;
    });
  }

  changeShowNotes() {
    this.showNotes = !this.showNotes;
    this.editNotes = false;
    this.imageCollectionNotes = this.imagesCollection.notes;
  }

  changeEditNotes() {
    this.editNotes = !this.editNotes;
  }

  saveNotes() {
    this.updateCollectionNotes(this.imageCollectionNotes);
    this. editNotes = false;
  }

  clearNotes() {
    this.imageCollectionNotes = this.imagesCollection.notes;
    this.editNotes = false;
  }

  openDownload(url: string) {
    this.imagesCollectionService.startDownload(url).subscribe(downloadUrl =>
      window.location.href = downloadUrl['url']);
  }

  openDeepZoomImage(wdztContent, image: Image): void {
    this.dzvVisible = true;
    this.selectedImage = image;
  }

  displayDeepZoomImage() {
    this.ngZone.runOutsideAngular(() => {
      const contrastParam = this.contrastField ? this.contrastField : '1';
      const colorMapParam = this.colorMapField ? ('&CMP=' + this.colorMapField) : '';
      const invertParam = this.invertField ? this.invertField : '';
      this.osdViewer = OpenSeadragon({
        id: 'openseadragon-img',
        prefixUrl: "https://cdn.jsdelivr.net/npm/openseadragon@4.1/build/openseadragon/images/",
        tileSources: [
          this.iipRootUrl
          + '?CNT='
          + contrastParam
          + colorMapParam
          + invertParam
          + '&IIIF='
          + this.imagesCollection.id + '/images/' + this.selectedImage.fileName + '/info.json'
        ]
      });
    });
 }

  closeDeepZoomImage() {
    if(this.osdViewer)
      this.osdViewer.destroy();
  }

  loadData(event) {
    const sortField = event.sortField ? event.sortField : 'fileName,asc';
    const params = {
      pageIndex: event.first / event.rows,
      size: event.rows,
      sort: sortField
    };
    this.imagesCollectionService.getImages(this.imagesCollection, params).subscribe(val =>
      this.imagesTest = val.data
    );
  }

  loadMetaFiles(event) {
    const sortField = event.sortField ? event.sortField : 'fileName,asc';
    const params = {
      pageIndex: event.first / event.rows,
      size: event.rows,
      sort: sortField
    };
    this.imagesCollectionService.getMetadataFiles(this.imagesCollection, params).subscribe(val =>
      this.metadataFiles2 = val.data
    );
  }

  ngOnDestroy() {
    this.dialogService.dialogComponentRefMap.forEach((dialog) => dialog.destroy());
  }
}
