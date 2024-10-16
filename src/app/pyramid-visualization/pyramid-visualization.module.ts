import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PyramidVisualizationListComponent } from './pyramid-visualization-list/pyramid-visualization-list.component';
import { PyramidVisualizationDetailComponent } from './pyramid-visualization-detail/pyramid-visualization-detail.component';
import { PyramidVisualizationNewComponent } from './pyramid-visualization-new/pyramid-visualization-new.component';
import { PyramidVisualizationHelpComponent } from './pyramid-visualization-help/pyramid-visualization-help.component';
import {PyramidVisualizationRoutingModule} from './pyramid-visualization-routing.module';
import {WdztModule} from '../wdzt/wdzt.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DropdownModule} from 'primeng/dropdown';
import {TableModule} from 'primeng/table';
import {ToastModule} from 'primeng/toast';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {FieldsetModule} from 'primeng/fieldset';
import {TooltipModule} from 'primeng/tooltip';
import {AutoCompleteModule} from 'primeng/autocomplete';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PyramidVisualizationRoutingModule,
    WdztModule,
    DropdownModule,
    TableModule,
    ToastModule,
    ButtonModule,
    InputTextModule,
    FieldsetModule,
    TooltipModule,
    AutoCompleteModule
  ],
  declarations: [
    PyramidVisualizationListComponent,
    PyramidVisualizationDetailComponent,
    PyramidVisualizationNewComponent,
    PyramidVisualizationHelpComponent],

})
export class PyramidVisualizationModule { }
