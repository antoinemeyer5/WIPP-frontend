import { Component, OnInit } from '@angular/core';
import {TensorflowModel} from '../tensorflow-model';
import {TensorflowModelService} from '../tensorflow-model.service';

@Component({
  selector: 'app-tensorflow-model-list',
  templateUrl: './tensorflow-model-list.component.html',
  styleUrls: ['./tensorflow-model-list.component.css']
})
export class TensorflowModelListComponent implements OnInit {
  tensorflowModels: TensorflowModel[];

  resultsLength = 0;
  pageSize = 10;

  constructor(
    private tensorflowModelService: TensorflowModelService) {
  }

  ngOnInit() {
    this.getTensorflowModels(null);
  }

  getTensorflowModels(event): void {
    const sortField = event?.sortOrder == -1 ? 'desc' : 'asc';
    const pageIndex = event ? event.first / event.rows : 0;
    const pageSize = event ? event.rows : this.pageSize;
    const params = {
      pageIndex: pageIndex,
      size: pageSize,
      sort: sortField
    };
    if(event?.filters?.global?.value) {
      this.tensorflowModelService.getByNameContainingIgnoreCase(params, event.filters.global.value).subscribe(result => {
        this.tensorflowModels = result.data;
        this.resultsLength = result.page.totalElements;
      });
    } else {
      this.tensorflowModelService.get(params).subscribe(result => {
        this.tensorflowModels = result.data;
        this.resultsLength = result.page.totalElements;
      });
    }
  }

}

