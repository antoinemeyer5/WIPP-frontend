import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WorkflowListComponent} from './workflow-list/workflow-list.component';
import {WorkflowRoutingModule} from './workflow-routing.module';
import {WorkflowDetailComponent} from './workflow-detail/workflow-detail.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SchemaFormModule, WidgetRegistry} from 'ngx-schema-form';
import {SearchWidgetComponent} from './widgets/search-widget/search-widget.component';
import {WidgetsRegistry} from './widgets/widgets-registry';
import {WorkflowNewComponent} from './workflow-new/workflow-new.component';
import {JobDetailComponent} from '../job/job-detail/job-detail.component';
import {NgxGraphModule} from '@swimlane/ngx-graph';
import {DynamicContentModule} from '../dynamic-content/dynamic-content.module';
import {NgxSpinnerModule} from 'ngx-spinner';
import {TableModule} from 'primeng/table';
import {ToastModule} from 'primeng/toast';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {TagModule} from 'primeng/tag';
import {FieldsetModule} from 'primeng/fieldset';
import {TooltipModule} from 'primeng/tooltip';
import {MessagesModule} from 'primeng/messages';
import {DropdownModule} from 'primeng/dropdown';
import {DialogModule} from 'primeng/dialog';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {ToolbarModule} from 'primeng/toolbar';
import {DividerModule} from 'primeng/divider';

@NgModule({
    imports: [
      CommonModule,
      WorkflowRoutingModule,
      FormsModule,
      ReactiveFormsModule,
      DynamicContentModule,
      SchemaFormModule.forRoot(),
      NgxGraphModule,
      NgxSpinnerModule,
      TableModule,
      ToastModule,
      ButtonModule,
      InputTextModule,
      TagModule,
      FieldsetModule,
      TooltipModule,
      MessagesModule,
      DropdownModule,
      DialogModule,
      AutoCompleteModule,
      ToolbarModule,
      DividerModule
    ],
    declarations: [
        WorkflowListComponent,
        WorkflowDetailComponent,
        SearchWidgetComponent,
        JobDetailComponent,
        WorkflowNewComponent
    ],
    providers: [{
        provide: WidgetRegistry,
        useClass: WidgetsRegistry
    }]
})
export class WorkflowModule { }
