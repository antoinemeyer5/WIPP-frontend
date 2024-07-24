import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import {StitchingVectorNewComponent} from './stitching-vector-new/stitching-vector-new.component';
import {StitchingVectorListComponent} from './stitching-vector-list/stitching-vector-list.component';
import {StitchingVectorDetailComponent} from './stitching-vector-detail/stitching-vector-detail.component';
import {StitchingVectorRoutingModule} from './stitching-vector-routing.module';
import {
  StitchingVectorTemplateComponent
} from './stitching-vector-template/stitching-vector-template.component';
import {ModalErrorComponent} from '../modal-error/modal-error.component';
import {TableModule} from 'primeng/table';
import {ToastModule} from 'primeng/toast';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {FieldsetModule} from 'primeng/fieldset';
import {TooltipModule} from 'primeng/tooltip';


@NgModule({
    imports: [
      CommonModule,
      StitchingVectorRoutingModule,
      FormsModule,
      TableModule,
      ToastModule,
      ButtonModule,
      InputTextModule,
      FieldsetModule,
      TooltipModule,
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
