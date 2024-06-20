import { Component, OnInit } from '@angular/core';
import { required, optional } from './modelcarddata_1.json';

@Component({
  selector: 'app-ai-modelcards-list',
  templateUrl: './ai-modelcards-list.component.html',
  styleUrls: ['./ai-modelcards-list.component.css']
})
export class AiModelCardsListComponent implements OnInit {
  data_required = required;
  data_optional = optional;

  constructor() {}

  ngOnInit() {}
}
