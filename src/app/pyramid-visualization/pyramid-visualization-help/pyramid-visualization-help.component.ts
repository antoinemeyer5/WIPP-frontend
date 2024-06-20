import { Component, Input, OnInit, Directive as  } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@()
@Directive()
@Component({
  selector: 'app-pyramid-visualization-help',
  templateUrl: './pyramid-visualization-help.component.html',
  styleUrls: ['./pyramid-visualization-help.component.css']
})
export class PyramidVisualizationHelpComponent implements OnInit {

  @Input() modalReference: any;
  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  cancel() {
    this.modalReference.dismiss();
  }

}
