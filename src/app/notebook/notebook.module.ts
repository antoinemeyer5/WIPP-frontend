import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import {FormsModule} from '@angular/forms';
import {NotebookRoutingModule} from './notebook-routing.module';
import { NotebookListComponent } from './notebook-list/notebook-list.component';
import { NotebookDetailComponent } from './notebook-detail/notebook-detail.component';
import {NotebookTemplateComponent} from './notebook-template/notebook-template.component';
import {NgxSpinnerModule} from 'ngx-spinner';

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    NotebookRoutingModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatInputModule,
    FormsModule,
    MatCheckboxModule,
    NgxSpinnerModule
  ],
  declarations: [
    NotebookListComponent,
    NotebookDetailComponent,
    NotebookTemplateComponent
  ]
})

export class NotebookModule { }
