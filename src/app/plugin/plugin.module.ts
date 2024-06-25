import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import {FormsModule} from '@angular/forms';
import {PluginRoutingModule} from './plugin-routing.module';
import {PluginListComponent} from './plugin-list/plugin-list.component';
import {PluginDetailComponent} from './plugin-detail/plugin-detail.component';
import { PluginNewComponent } from './plugin-new/plugin-new.component';
import {NgxJsonViewerModule} from 'ngx-json-viewer';

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    PluginRoutingModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatInputModule,
    FormsModule,
    MatCheckboxModule,
    NgxJsonViewerModule
  ],
  declarations: [
    PluginListComponent,
    PluginDetailComponent,
    PluginNewComponent
  ]
})
export class PluginModule { }
