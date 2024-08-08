import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Plugin} from '../plugin';
import {PluginService} from '../plugin.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {catchError, map, switchMap} from 'rxjs/operators';
import {BehaviorSubject, Observable, of as observableOf} from 'rxjs';
import {SelectionModel} from '@angular/cdk/collections';
import {PluginNewComponent} from '../plugin-new/plugin-new.component';
import {KeycloakService} from '../../services/keycloak/keycloak.service';
import {DialogService} from 'primeng/dynamicdialog';
import {MessageService} from 'primeng/api';
import {StitchingVectorNewComponent} from '../../stitching-vector/stitching-vector-new/stitching-vector-new.component';

@Component({
  selector: 'app-plugin-list',
  templateUrl: './plugin-list.component.html',
  styleUrls: ['./plugin-list.component.css'],
  providers: [DialogService, MessageService]
})
export class PluginListComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [ 'name', 'version', 'description'];
  plugins: Plugin[];
  selection = new SelectionModel<Plugin>(false, []);

  resultsLength = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [10, 25, 50, 100];
  paramsChange: BehaviorSubject<{index: number, size: number, sort: string, filter: string}>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private modalService: NgbModal,
    private pluginService: PluginService,
    private keycloakService: KeycloakService,
    private dialogService: DialogService,
    private messageService: MessageService,
  ) {
    this.paramsChange = new BehaviorSubject({
      index: 0,
      size: this.pageSize,
      sort: 'creationDate,desc',
      filter: ''
    });
  }

  sortChanged(sort) {
    // If the user changes the sort order, reset back to the first page.
    this.paramsChange.next({
      index: 0, size: this.paramsChange.value.size,
      sort: sort.active + ',' + sort.direction, filter: this.paramsChange.value.filter
    });
  }

  pageChanged(page) {
    this.paramsChange.next({
      index: page.pageIndex, size: page.pageSize,
      sort: this.paramsChange.value.sort, filter: this.paramsChange.value.filter
    });
  }

  applyFilterByName(filterValue: string) {
    // if the user filters by name, reset back to the first page
    this.paramsChange.next({
      index: 0, size: this.paramsChange.value.size, sort: this.paramsChange.value.sort, filter: filterValue
    });
  }

  ngOnInit() {
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
      this.pluginService.getPluginsByNameContainingIgnoreCase(params, event.filters.global.value).subscribe(result => {
        this.plugins = result.plugins;
        this.resultsLength = result.page.totalElements;
      });
    } else {
      this.pluginService.getPlugins(params).subscribe(result => {
        this.plugins = result.plugins;
        this.resultsLength = result.page.totalElements;
      });
    }
  }

  displayNewPluginModal() {
    this.dialogService.open(PluginNewComponent, {
      header: 'New plugin',
      position: 'top',
      width: '50vw',
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      }
    });
  }

  canCreate(): boolean {
    return (this.keycloakService.hasRole('admin') || this.keycloakService.hasRole('developer'));
  }

  ngOnDestroy() {
    this.dialogService.dialogComponentRefMap.forEach((dialog) => dialog.destroy());
  }

}
