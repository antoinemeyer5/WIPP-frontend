import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AiModelCardsRoutingModule } from './ai-modelcards-routing.module';
import { AiModelCardsListComponent } from './ai-modelcards-list/ai-modelcards-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InlineEditorModule } from '@qontu/ngx-inline-editor';

@NgModule({
  imports: [
    CommonModule,
    AiModelCardsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    InlineEditorModule
  ],
  entryComponents: [],
  declarations: [
    AiModelCardsListComponent
  ]
})
export class AiModelCardsModule { }
