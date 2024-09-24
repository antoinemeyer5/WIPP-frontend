import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiModelListComponent } from './ai-model-list/ai-model-list.component';
import { AiModelDetailComponent } from './ai-model-detail/ai-model-detail.component';
import { AiModelRoutingModule } from './ai-model-routing.module';
import { AiModelTemplateComponent } from './ai-model-template/ai-model-template.component';
import { TensorboardLogsTemplateComponent } from './ai-model-template/tensorboard-logs-template.component';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FieldsetModule } from 'primeng/fieldset';
import { TooltipModule } from 'primeng/tooltip';
import { ChartModule } from 'primeng/chart';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AiModelRoutingModule,
    TableModule,
    ToastModule,
    ButtonModule,
    InputTextModule,
    FieldsetModule,
    TooltipModule,
    ChartModule,
    DropdownModule
  ],
  declarations: [
    AiModelListComponent,
    AiModelDetailComponent,
    AiModelTemplateComponent,
    TensorboardLogsTemplateComponent
  ]
})
export class AiModelModule { }
