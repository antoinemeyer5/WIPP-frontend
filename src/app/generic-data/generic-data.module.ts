import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericDataListComponent } from './generic-data-list/generic-data-list.component';
import { GenericDataDetailComponent } from './generic-data-detail/generic-data-detail.component';
import { GenericDataTemplateComponent } from './generic-data-template/generic-data-template.component';
import {GenericDataRoutingModule} from './generic-data-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { GenericDataNewComponent } from './generic-data-new/generic-data-new.component';
import { FormsModule } from '@angular/forms';
import {TableModule} from 'primeng/table';
import {ToastModule} from 'primeng/toast';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {TooltipModule} from 'primeng/tooltip';
import {FieldsetModule} from 'primeng/fieldset';
import {ProgressBarModule} from 'primeng/progressbar';
import {CustomPipesModule} from '../custom-pipes/custom-pipes.module';

@NgModule({
  imports: [
    CommonModule,
    GenericDataRoutingModule,
    HttpClientModule,
    FormsModule,
    TableModule,
    ToastModule,
    TooltipModule,
    ButtonModule,
    FieldsetModule,
    InputTextModule,
    ProgressBarModule,
    InputTextModule,
    CustomPipesModule
  ],
  declarations: [
    GenericDataListComponent,
    GenericDataDetailComponent,
    GenericDataTemplateComponent,
    GenericDataNewComponent
  ]
})
export class GenericDataModule { }
