import {Component, Input} from '@angular/core';
import {DialogService, DynamicDialogComponent, DynamicDialogRef} from 'primeng/dynamicdialog';

@Component({
  selector: 'app-modal-error',
  templateUrl: './modal-error.component.html',
  styleUrls: ['./modal-error.component.css']
})
export class ModalErrorComponent {
  message: string = '';
  instance: DynamicDialogComponent | undefined;

  constructor(public modalReference: DynamicDialogRef,  private dialogService: DialogService) {
    this.instance = this.dialogService.getInstance(this.modalReference);
  }

  ngOnInit() {
    if (this.instance && this.instance.data) {
      this.message = this.instance.data['message'];
    }
  }

  close() {
    this.modalReference.close();
  }
}

