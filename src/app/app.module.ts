import { BrowserModule } from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';
import { AppComponent } from './app.component';

import { PageNotFoundComponent } from './not-found/not-found.component';
import { AppRoutingModule } from './app-routing.module';
import { ImagesCollectionModule } from './images-collection/images-collection.module';
import { PluginModule } from './plugin/plugin.module';
import {HttpClientModule} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatLegacyTableModule as MatTableModule} from '@angular/material/legacy-table';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import {FormsModule} from '@angular/forms';
import {WorkflowModule} from './workflow/workflow.module';
import {MatLegacyCheckboxModule as MatCheckboxModule} from '@angular/material/legacy-checkbox';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {StitchingVectorModule} from './stitching-vector/stitching-vector.module';
import {PyramidModule} from './pyramid/pyramid.module';
import {TensorflowModelModule} from './tensorflow-model/tensorflow-model.module';
import {CsvCollectionModule} from './csv-collection/csv-collection.module';
import {UnknownDynamicComponent } from './dynamic-content/unknown-dynamic.component';
import {NotebookModule} from './notebook/notebook.module';
import {AppConfigService} from './app-config.service';
import {appInitializerFactory} from './app-init-factory';
import { KeycloakService } from './services/keycloak/keycloak.service';
import { KeycloakInterceptorService} from './services/keycloak/keycloak.interceptor.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {PyramidVisualizationModule} from './pyramid-visualization/pyramid-visualization.module';
import { ForbiddenAccessComponent } from './forbidden-access/forbidden-access.component';
import {PyramidAnnotationModule} from './pyramid-annotation/pyramid-annotation.module';
import { GenericDataModule } from './generic-data/generic-data.module';
import {ConfirmDialogService} from './confirm-dialog/confirm-dialog.service';
import {ConfirmDialogModule} from './confirm-dialog/confirm-dialog.module';
import {HomeModule} from './home/home.module';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    // UnknownDynamicComponent,
    ForbiddenAccessComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HomeModule,
    ImagesCollectionModule,
    StitchingVectorModule,
    PyramidAnnotationModule,
    PyramidModule,
    PyramidVisualizationModule,
    TensorflowModelModule,
    CsvCollectionModule,
    NotebookModule,
    GenericDataModule,
    PluginModule,
    WorkflowModule,
    ConfirmDialogModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    FormsModule,
    MatCheckboxModule,
    NgbModule
  ],
  providers: [
    AppConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFactory,
      multi: true,
      deps: [AppConfigService]
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: KeycloakInterceptorService,
      multi: true
    },
    KeycloakService,
    ConfirmDialogService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
