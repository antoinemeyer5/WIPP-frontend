import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgMathPipesModule} from 'angular-pipes';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {PyramidRoutingModule} from './pyramid-routing.module';
import {PyramidListComponent} from './pyramid-list/pyramid-list.component';
import {PyramidDetailComponent} from './pyramid-detail/pyramid-detail.component';
import {WdztModule} from '../wdzt/wdzt.module';
import {PyramidTemplateComponent} from './pyramid-template/pyramid-template.component';
import {TableModule} from 'primeng/table';
import {ToastModule} from 'primeng/toast';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {FieldsetModule} from 'primeng/fieldset';
import {TooltipModule} from 'primeng/tooltip';

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    NgMathPipesModule,
    PyramidRoutingModule,
    FormsModule,
    WdztModule,
    TableModule,
    ToastModule,
    ButtonModule,
    InputTextModule,
    FieldsetModule,
    TooltipModule
  ],
  declarations: [
    PyramidDetailComponent,
    PyramidListComponent,
    PyramidTemplateComponent
  ]
})
export class PyramidModule {
}
