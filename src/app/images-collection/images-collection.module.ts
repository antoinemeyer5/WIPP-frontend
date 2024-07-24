import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ImagesCollectionRoutingModule} from './images-collection-routing.module';
import {ImagesCollectionDetailComponent} from './images-collection-detail/images-collection-detail.component';
import {ImagesCollectionListComponent} from './images-collection-list/images-collection-list.component';
import {NgBytesPipeModule} from 'angular-pipes';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { ImagesCollectionNewComponent } from './images-collection-new/images-collection-new.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  ImagesCollectionTemplateComponent
} from './images-collection-template/images-collection-template.component';
import {NgxSpinnerModule} from 'ngx-spinner';
import {DataViewModule} from 'primeng/dataview';
import {DropdownModule} from 'primeng/dropdown';
import { ImagesCollectionBatchImportComponent } from './images-collection-batch-import/images-collection-batch-import.component';
import {TableModule} from 'primeng/table';
import {ToolbarModule} from 'primeng/toolbar';
import {ButtonModule} from 'primeng/button';
import {SplitButtonModule} from 'primeng/splitbutton';
import {InputTextModule} from 'primeng/inputtext';
import {CardModule} from 'primeng/card';
import {TooltipModule} from 'primeng/tooltip';
import {FieldsetModule} from 'primeng/fieldset';
import {SkeletonModule} from 'primeng/skeleton';
import {ProgressBarModule} from 'primeng/progressbar';
import {ToastModule} from 'primeng/toast';
import {DialogModule} from 'primeng/dialog';
import {ButtonGroupModule} from 'primeng/buttongroup';
import {RadioButtonModule} from 'primeng/radiobutton';
import {CheckboxModule} from 'primeng/checkbox';
import {OverlayPanelModule} from 'primeng/overlaypanel';

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    ImagesCollectionRoutingModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    NgxSpinnerModule,
    DataViewModule,
    DropdownModule,
    TableModule,
    ToolbarModule,
    ButtonModule,
    SplitButtonModule,
    ButtonGroupModule,
    InputTextModule,
    CardModule,
    TooltipModule,
    FieldsetModule,
    SkeletonModule,
    ProgressBarModule,
    ToastModule,
    DialogModule,
    RadioButtonModule,
    CheckboxModule,
    OverlayPanelModule,
    NgBytesPipeModule
  ],
  declarations: [
    ImagesCollectionDetailComponent,
    ImagesCollectionListComponent,
    ImagesCollectionNewComponent,
    ImagesCollectionTemplateComponent,
    ImagesCollectionBatchImportComponent
  ]
})
export class ImagesCollectionModule { }
