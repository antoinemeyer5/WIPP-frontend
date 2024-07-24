import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {PluginService} from '../plugin.service';
import {Router} from '@angular/router';
import {MessageService} from 'primeng/api';
import {DynamicDialogRef} from 'primeng/dynamicdialog';

@Component({
  selector: 'app-plugin-new',
  templateUrl: './plugin-new.component.html',
  styleUrls: ['./plugin-new.component.css'],
  providers: [MessageService]
})
export class PluginNewComponent implements OnInit {


  @ViewChild('browsePlugin') browsePlugin: ElementRef;
  @ViewChild('linkPlugin') linkPlugin: ElementRef;
  @ViewChild('pluginDescriptorText') pluginDescriptorText: ElementRef;

  displayAlert = false;
  alertMessage = '';
  alertType = 'danger';

  pluginJSON;

  constructor(
    private activeModal: DynamicDialogRef,
    private messageService: MessageService,
    private pluginService: PluginService,
    private router: Router) {
  }

  ngOnInit() {
  }

  onFileSelected(event) {
    const reader = new FileReader();
    reader.readAsText(event.target.files[0]);
    const self = this;
    reader.onload = function () {
      self.pluginJSON = reader.result;
    };
  }

  getByUrl(url) {
    this.pluginService.getJsonFromURL(url).subscribe(
      data => {
        this.pluginJSON = JSON.stringify(data, undefined, 7);
      },
      err => {
        this.messageService.add({ severity: 'error', summary: 'Error',
          detail: 'Unable to get JSON from URL (for manifests hosted on Github, please use raw URL)' });
      }
    );
  }

  clearAll() {
    this.pluginJSON = null;
    this.browsePlugin.nativeElement.value = '';
    this.linkPlugin.nativeElement.value = '';
  }

  cancel() {
    this.activeModal.close();
  }

  isJsonValid(textToTest) {
    try {
      // parse it to json
      const data = JSON.parse(textToTest);
      return [true];
    } catch (ex) {
      // set parse error if it fails
      return [false, ex];
    }
  }

  postPlugin(pluginText) {
    const jsonState = this.isJsonValid(pluginText);
    if (jsonState[0]) {
      this.pluginService.postPlugin(pluginText).subscribe(
        plugin => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: "Plugin registered. Redirecting..." });
          const pluginId = plugin ? plugin.id : null;
          setTimeout(() => {
            this.router.navigate(['plugins', pluginId]);
          }, 2000);
        },
        err => {
          this.messageService.add({ severity: 'error', summary: 'Could not register plugin', detail: err.error.message });
        });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Invalid JSON', detail: jsonState[1] });
    }
  }

}
