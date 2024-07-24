import { Component, OnInit } from '@angular/core';
import {AiModel} from '../ai-model';
import {AiModelService} from '../ai-model.service';

@Component({
  selector: 'app-ai-model-list',
  templateUrl: './ai-model-list.component.html',
  styleUrls: ['./ai-model-list.component.css']
})
export class AiModelListComponent implements OnInit {
  aiModels: AiModel[];

  resultsLength = 0;
  pageSize = 10;

  constructor(
    private aiModelService: AiModelService) {
  }

  ngOnInit() {
    this.getAiModels(null);
  }

  getAiModels(event): void {
    const sortField = event?.sortOrder == -1 ? 'desc' : 'asc';
    const pageIndex = event ? event.first / event.rows : 0;
    const pageSize = event ? event.rows : this.pageSize;
    const params = {
      pageIndex: pageIndex,
      size: pageSize,
      sort: sortField
    };
    if(event?.filters?.global?.value) {
      this.aiModelService.getByNameContainingIgnoreCase(params, event.filters.global.value).subscribe(result => {
        this.aiModels = result.data;
        this.resultsLength = result.page.totalElements;
      });
    } else {
      this.aiModelService.get(params).subscribe(result => {
        this.aiModels = result.data;
        this.resultsLength = result.page.totalElements;
      });
    }
  }

}

