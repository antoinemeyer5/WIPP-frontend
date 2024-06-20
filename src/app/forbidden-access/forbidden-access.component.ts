import { Component, OnInit, Directive as  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@()
@Directive()
@Component({
  selector: 'app-forbidden-access',
  templateUrl: './forbidden-access.component.html',
  styleUrls: ['./forbidden-access.component.css']
})
export class ForbiddenAccessComponent implements OnInit {
  constructor() { }

  ngOnInit() {
  }

}
