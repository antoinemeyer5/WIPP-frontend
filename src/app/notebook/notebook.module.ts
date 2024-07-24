import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NotebookRoutingModule} from './notebook-routing.module';
import { NotebookListComponent } from './notebook-list/notebook-list.component';
import { NotebookDetailComponent } from './notebook-detail/notebook-detail.component';
import {NotebookTemplateComponent} from './notebook-template/notebook-template.component';
import {FieldsetModule} from 'primeng/fieldset';
import {TableModule} from 'primeng/table';
import {InputTextModule} from 'primeng/inputtext';
import {InputIconModule} from 'primeng/inputicon';
import {IconFieldModule} from 'primeng/iconfield';
import {SkeletonModule} from 'primeng/skeleton';
import {ToastModule} from 'primeng/toast';

@NgModule({
  imports: [
    CommonModule,
    NotebookRoutingModule,
    FieldsetModule,
    TableModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    SkeletonModule,
    ToastModule
  ],
  declarations: [
    NotebookListComponent,
    NotebookDetailComponent,
    NotebookTemplateComponent
  ]
})

export class NotebookModule { }
