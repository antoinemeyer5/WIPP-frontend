import {DynamicComponent} from '../../dynamic-content/dynamic.component';
import {TensorflowModelService} from '../tensorflow-model.service';
import { Component, OnInit, Directive as  } from '@angular/core';
import {AppConfigService} from '../../app-config.service';
import urljoin from 'url-join';

@()
@Directive()
@Component({
  selector: 'app-stitching-vector-template',
  template:
    '<a href="{{tensorboardLink}}" target="_blank"> {{text}} </a>'
})
export class TensorboardLogsTemplateComponent extends DynamicComponent implements OnInit {

  constructor(
    private appConfigService: AppConfigService,
    private tensorflowModelService: TensorflowModelService) {
    super();
  }
  static key = 'tensorboardlogstemplatecomponent';
  tensorboardLink = '';

  ngOnInit() {
      this.tensorflowModelService.getTensorboardLogsByJob(this.jobId).subscribe(result => {
        this.text = result.name;
        this.tensorboardLink = urljoin(this.appConfigService.getConfig().tensorboardUrl,
          '#scalars&regexInput=' + result.name);
      });
  }
}
