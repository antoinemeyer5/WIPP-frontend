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
import {TableModule} from 'primeng/table';
import {ToastModule} from 'primeng/toast';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {TooltipModule} from 'primeng/tooltip';
import {FieldsetModule} from 'primeng/fieldset';
import {DialogModule} from 'primeng/dialog';
import {ConfirmDialogModule} from 'primeng/confirmdialog';

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
    NgxJsonViewerModule,
    TableModule,
    ToastModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
    FieldsetModule,
    DialogModule,
    ConfirmDialogModule
  ],
  declarations: [
    PluginListComponent,
    PluginDetailComponent,
    PluginNewComponent
  ]
})
export class PluginModule { }
