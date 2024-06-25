import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgMathPipesModule} from 'angular-pipes';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import {FormsModule} from '@angular/forms';
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
        NgbModule,
        NgMathPipesModule,
        StitchingVectorRoutingModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        MatTableModule,
        MatSortModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatCheckboxModule
    ],
    declarations: [
        StitchingVectorDetailComponent,
        StitchingVectorListComponent,
        StitchingVectorNewComponent,
        ModalErrorComponent,
        StitchingVectorTemplateComponent
    ]
})
export class StitchingVectorModule { }
