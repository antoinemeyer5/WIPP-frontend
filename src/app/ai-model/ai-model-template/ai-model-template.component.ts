import { Component, OnInit } from '@angular/core';
import { DynamicComponent } from '../../dynamic-content/dynamic.component';
import { AIModelService } from '../ai-model.service';


@Component({
  selector: 'app-stitching-vector-template',
  template:
    '<a routerLink="/ai-models/{{idData}}">{{text}}</a>'
})
export class AIModelTemplateComponent extends DynamicComponent implements OnInit {

  constructor(private aiModelService: AIModelService) { super(); }

  static key = 'aimodeltemplatecomponent';

  ngOnInit() {
      if (this.idData) {
      this.aiModelService.getById(this.idData).subscribe(result => {
        this.text = result.name;
      });
    }
  }
}
