import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AiModelListComponent } from './ai-model-list/ai-model-list.component';
import { AiModelDetailComponent } from './ai-model-detail/ai-model-detail.component';
import { AiModelRoutingModule } from './ai-model-routing.module';
import { MatFormFieldModule, MatInputModule, MatPaginator, MatPaginatorModule, MatSortModule, MatTableModule } from '@angular/material';
import { AiModelTemplateComponent } from './ai-model-template/ai-model-template.component';
import { TensorboardLogsTemplateComponent } from './ai-model-template/tensorboard-logs-template.component';

@NgModule({
  imports: [
    CommonModule,
    AiModelRoutingModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule
  ],
  declarations: [
    AiModelListComponent,
    AiModelDetailComponent,
    AiModelTemplateComponent,
    TensorboardLogsTemplateComponent
  ]
})
export class AiModelModule { }
