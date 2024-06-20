import { Component, OnInit, Directive as  } from '@angular/core';
import {DynamicComponent} from '../../dynamic-content/dynamic.component';
import {StitchingVectorService} from '../stitching-vector.service';


@()
@Directive()
@Component({
  selector: 'app-stitching-vector-template',
  template:
    '<a routerLink="/stitching-vectors/{{idData}}">{{text}}</a>'
})
export class StitchingVectorTemplateComponent extends DynamicComponent implements OnInit {

    constructor(
    private stitchingVectorService: StitchingVectorService) {
    super();
}

static key = 'stitchingvectortemplatecomponent';

  ngOnInit() {
      this.stitchingVectorService.getById(this.idData).subscribe(result => {
        this.text = result.name;
      });
    }
}
