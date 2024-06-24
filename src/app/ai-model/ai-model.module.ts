import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AIModelListComponent } from './ai-model-list/ai-model-list.component';
import { AIModelDetailComponent } from './ai-model-detail/ai-model-detail.component';
import { AIModelRoutingModule } from './ai-model-routing.module';
import { MatFormFieldModule, MatInputModule, MatPaginator, MatPaginatorModule, MatSortModule, MatTableModule } from '@angular/material';
import { AIModelTemplateComponent } from './ai-model-template/ai-model-template.component';
import { TensorboardLogsTemplateComponent } from './ai-model-template/tensorboard-logs-template.component';

@NgModule({
  imports: [
    CommonModule,
    AIModelRoutingModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule
  ],
  declarations: [AIModelListComponent,
    AIModelDetailComponent,
    AIModelTemplateComponent,
    TensorboardLogsTemplateComponent
  ]
})
export class AIModelModule { }
