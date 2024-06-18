import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
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
import {PyramidRoutingModule} from './pyramid-routing.module';
import {PyramidListComponent} from './pyramid-list/pyramid-list.component';
import {PyramidDetailComponent} from './pyramid-detail/pyramid-detail.component';
import {WdztModule} from '../wdzt/wdzt.module';
import {PyramidTemplateComponent} from './pyramid-template/pyramid-template.component';

@NgModule({
  imports: [
    CommonModule,
    NgbModule.forRoot(),
    NgMathPipesModule,
    PyramidRoutingModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    InlineEditorModule,
    MatCheckboxModule,
    WdztModule
  ],
  declarations: [
    PyramidDetailComponent,
    PyramidListComponent,
    PyramidTemplateComponent
  ]
})
export class PyramidModule {
}
