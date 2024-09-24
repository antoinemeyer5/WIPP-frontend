import { Component, OnInit } from '@angular/core';
import { AiModel } from '../ai-model';
import { AiModelService } from '../ai-model.service';

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

  getAiModels(event) {
    const sortOrderStr = event?.sortOrder == -1 ? 'desc' : 'asc';
    const sortField = event?.sortField ? event.sortField + ',' + sortOrderStr : 'creationDate,desc';
    const params = {
      pageIndex: event.first / event.rows,
      size: event.rows,
      sort: sortField
    };
    if (event?.filters?.global?.value) {
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

