import {Component} from '@angular/core';
import {DynamicComponent} from './dynamic.component';

@Component({
  selector: 'app-unknown-dynamic',
  template: '<a>{{defaultText}}</a>'
})
export class UnknownDynamicComponent extends DynamicComponent {
}
