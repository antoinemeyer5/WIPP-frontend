import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CsvCollectionListComponent } from './csv-collection-list/csv-collection-list.component';
import { CsvCollectionDetailComponent } from './csv-collection-detail/csv-collection-detail.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import {CsvCollectionRoutingModule} from './csv-collection-routing.module';
import { CsvCollectionTemplateComponent } from './csv-collection-template/csv-collection-template.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { CsvCollectionNewComponent } from './csv-collection-new/csv-collection-new.component';
import { FormsModule } from '@angular/forms';
import {NgBytesPipeModule} from 'angular-pipes';

@NgModule({
  imports: [
    CommonModule,
    CsvCollectionRoutingModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    NgbModule,
    FormsModule,
    MatCheckboxModule,
    NgBytesPipeModule
  ],
  declarations: [
    CsvCollectionListComponent,
    CsvCollectionDetailComponent,
    CsvCollectionTemplateComponent,
    CsvCollectionNewComponent
  ]
})
export class CsvCollectionModule { }
