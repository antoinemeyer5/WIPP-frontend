import { Component, OnInit } from '@angular/core';
import {Pyramid} from '../pyramid';
import {PyramidService} from '../pyramid.service';

@Component({
  selector: 'app-pyramid-list',
  templateUrl: './pyramid-list.component.html',
  styleUrls: ['./pyramid-list.component.css']
})
export class PyramidListComponent implements OnInit {
  pyramids: Pyramid[];

  resultsLength = 0;
  pageSize = 10;

  constructor(
    private pyramidService: PyramidService
  ) {
  }

  ngOnInit() {
    this.getPyramids(null);
  }

  getPyramids(event): void {
    const sortOrderStr = event?.sortOrder == -1 ? 'desc' : 'asc';
    const sortField = event?.sortField ? event.sortField + ',' + sortOrderStr : 'creationDate,desc';
    const pageIndex = event ? event.first / event.rows : 0;
    const pageSize = event ? event.rows : this.pageSize;
    const params = {
      pageIndex: pageIndex,
      size: pageSize,
      sort: sortField
    };
    if(event?.filters?.global?.value) {
      this.pyramidService.getByNameContainingIgnoreCase(params, event.filters.global.value).subscribe(result => {
        this.pyramids = result.data;
        this.resultsLength = result.page.totalElements;
      });
    } else {
      this.pyramidService.get(params).subscribe(result => {
        this.pyramids = result.data;
        this.resultsLength = result.page.totalElements;
      });
    }
  }
}
