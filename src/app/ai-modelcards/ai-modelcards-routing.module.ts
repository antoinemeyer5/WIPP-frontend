import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AiModelCardsListComponent } from './ai-modelcards-list/ai-modelcards-list.component';

const imagesCollectionsRoutes: Routes = [
  { path: 'ai-modelcards', component: AiModelCardsListComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(imagesCollectionsRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class AiModelCardsRoutingModule {}
