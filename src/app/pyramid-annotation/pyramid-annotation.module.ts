import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PyramidAnnotationTemplateComponent } from './pyramid-annotation-template/pyramid-annotation-template.component';
import { PyramidAnnotationListComponent } from './pyramid-annotation-list/pyramid-annotation-list.component';
import {PyramidAnnotationRoutingModule} from './pyramid-annotation-routing.module';
import { PyramidAnnotationDetailComponent } from './pyramid-annotation-detail/pyramid-annotation-detail.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    PyramidAnnotationTemplateComponent,
    PyramidAnnotationListComponent,
    PyramidAnnotationDetailComponent],
  imports: [
    CommonModule,
    PyramidAnnotationRoutingModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatInputModule,
    NgbModule,
    FormsModule
  ]
})
export class PyramidAnnotationModule { }
