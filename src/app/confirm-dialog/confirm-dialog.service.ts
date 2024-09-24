import { Injectable } from '@angular/core';
import {ConfirmDialogComponent} from './confirm-dialog.component';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {

  constructor(
    private modalService: DialogService
  ) { }

  createConfirmModal(title: string, message: string, warnings: string[]): DynamicDialogRef {
    const modalRefConfirm = this.modalService.open(ConfirmDialogComponent, {
      header: title,
      position: 'top',
      width: '50vw',
      data: {
        message: message,
        warnings: warnings
      },
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      }
    });
    return modalRefConfirm;
  }
}
