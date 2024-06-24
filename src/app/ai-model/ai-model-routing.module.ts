import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AIModelDetailComponent } from './ai-model-detail/ai-model-detail.component';
import { AIModelListComponent } from './ai-model-list/ai-model-list.component';

const aiModelsRoutes: Routes = [
  { path: 'ai-models', component: AIModelListComponent },
  { path: 'ai-models/:id', component: AIModelDetailComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(aiModelsRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class AIModelRoutingModule {}
