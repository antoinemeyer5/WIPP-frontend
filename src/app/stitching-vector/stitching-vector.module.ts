import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgMathPipesModule} from 'angular-pipes';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import {FormsModule} from '@angular/forms';
import {InlineEditorModule} from '@qontu/ngx-inline-editor';
import {StitchingVectorNewComponent} from './stitching-vector-new/stitching-vector-new.component';
import {StitchingVectorListComponent} from './stitching-vector-list/stitching-vector-list.component';
import {StitchingVectorDetailComponent} from './stitching-vector-detail/stitching-vector-detail.component';
import {StitchingVectorRoutingModule} from './stitching-vector-routing.module';
import {
  StitchingVectorTemplateComponent
} from './stitching-vector-template/stitching-vector-template.component';
import {ModalErrorComponent} from '../modal-error/modal-error.component';


@NgModule({
  imports: [
    CommonModule,
    NgbModule.forRoot(),
    NgMathPipesModule,
    StitchingVectorRoutingModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    InlineEditorModule,
    MatCheckboxModule
  ],
  entryComponents: [StitchingVectorNewComponent, ModalErrorComponent],
  declarations: [
    StitchingVectorDetailComponent,
    StitchingVectorListComponent,
    StitchingVectorNewComponent,
    ModalErrorComponent,
    StitchingVectorTemplateComponent
  ]
})
export class StitchingVectorModule { }
