import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ConfirmDialogComponent} from './confirm-dialog.component';
import {DialogService, DynamicDialogModule} from 'primeng/dynamicdialog';
import {MessagesModule} from 'primeng/messages';
import {ButtonModule} from 'primeng/button';

@NgModule({
  imports: [
    CommonModule,
    DynamicDialogModule,
    MessagesModule,
    ButtonModule
  ],
  providers: [
    DialogService
  ],
  declarations: [
    ConfirmDialogComponent],
  exports: [
    ConfirmDialogComponent
  ]
})
export class ConfirmDialogModule { }
