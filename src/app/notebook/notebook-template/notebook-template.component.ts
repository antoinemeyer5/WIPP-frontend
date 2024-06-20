import { Component, OnInit, Directive as  } from '@angular/core';
import {DynamicComponent} from '../../dynamic-content/dynamic.component';
import {NotebookService} from '../notebook.service';

@()
@Directive()
@Component({
  selector: 'app-notebook-template',
  template:
  ' <a routerLink="/notebooks/{{idData}}">{{text}}</a>'
})
export class NotebookTemplateComponent extends DynamicComponent implements OnInit {

    constructor(
    private notebookService: NotebookService) {
    super();
}

static key = 'notebooktemplatecomponent';

  ngOnInit() {
      this.notebookService.getById(this.idData).subscribe(result => {
        this.text = result.name;
      });
  }
}
