import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CsvCollectionListComponent } from './csv-collection-list/csv-collection-list.component';
import { CsvCollectionDetailComponent } from './csv-collection-detail/csv-collection-detail.component';
import {CsvCollectionRoutingModule} from './csv-collection-routing.module';
import { CsvCollectionTemplateComponent } from './csv-collection-template/csv-collection-template.component';
import { CsvCollectionNewComponent } from './csv-collection-new/csv-collection-new.component';
import { FormsModule } from '@angular/forms';
import {NgBytesPipeModule} from 'angular-pipes';
import {TableModule} from 'primeng/table';
import {ToastModule} from 'primeng/toast';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {FieldsetModule} from 'primeng/fieldset';
import {TooltipModule} from 'primeng/tooltip';
import {ProgressBarModule} from 'primeng/progressbar';

@NgModule({
  imports: [
    CommonModule,
    CsvCollectionRoutingModule,
    FormsModule,
    NgBytesPipeModule,
    TableModule,
    ToastModule,
    ButtonModule,
    InputTextModule,
    FieldsetModule,
    TooltipModule,
    ProgressBarModule
  ],
  declarations: [
    CsvCollectionListComponent,
    CsvCollectionDetailComponent,
    CsvCollectionTemplateComponent,
    CsvCollectionNewComponent
  ]
})
export class CsvCollectionModule { }
