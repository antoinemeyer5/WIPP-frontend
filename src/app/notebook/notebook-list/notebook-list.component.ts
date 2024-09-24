import { Component } from '@angular/core';
import {Notebook} from '../notebook';
import {NotebookService} from '../notebook.service';

@Component({
  selector: 'app-notebook-list',
  templateUrl: './notebook-list.component.html',
  styleUrls: ['./notebook-list.component.css']
})
export class NotebookListComponent {
  notebooks: Notebook[];

  resultsLength = 0;
  pageSize = 10;

  constructor(
    private notebookService: NotebookService) {
  }

  loadData(event) {
    const sortOrderStr = event?.sortOrder == -1 ? 'desc' : 'asc';
    const sortField = event?.sortField ? event.sortField + ',' + sortOrderStr : 'creationDate,desc';
    const pageIndex = event ? event.first / event.rows : 0;
    const pageSize = event ? event.rows : this.pageSize;
    const params = {
      pageIndex: pageIndex,
      size: pageSize,
      sort: sortField
    };
    if(event.filters?.global?.value) {
      this.notebookService.getByNameContainingIgnoreCase(params, event.filters.global.value).subscribe(result => {
        this.notebooks = result.data;
        this.resultsLength = result.page.totalElements;
      });
    } else {
      this.notebookService.get(params).subscribe(result => {
        this.notebooks = result.data;
        this.resultsLength = result.page.totalElements;
      });
    }
  }
}
