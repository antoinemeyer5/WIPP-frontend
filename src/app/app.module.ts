import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { AppComponent } from './app.component';

import { PageNotFoundComponent } from './not-found/not-found.component';
import { AppRoutingModule } from './app-routing.module';
import { ImagesCollectionModule } from './images-collection/images-collection.module';
import { PluginModule } from './plugin/plugin.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { FormsModule } from '@angular/forms';
import { WorkflowModule } from './workflow/workflow.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StitchingVectorModule } from './stitching-vector/stitching-vector.module';
import { PyramidModule } from './pyramid/pyramid.module';
import { AiModelModule } from './ai-model/ai-model.module';
import { AiModelCardModule } from './ai-model-card/ai-model-card.module';
import { CsvCollectionModule } from './csv-collection/csv-collection.module';
import { NotebookModule } from './notebook/notebook.module';
import { AppConfigService } from './app-config.service';
import { appInitializerFactory } from './app-init-factory';
import { KeycloakService } from './services/keycloak/keycloak.service';
import { KeycloakInterceptorService } from './services/keycloak/keycloak.interceptor.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { PyramidVisualizationModule } from './pyramid-visualization/pyramid-visualization.module';
import { ForbiddenAccessComponent } from './forbidden-access/forbidden-access.component';
import { PyramidAnnotationModule } from './pyramid-annotation/pyramid-annotation.module';
import { GenericDataModule } from './generic-data/generic-data.module';
import { ConfirmDialogService } from './confirm-dialog/confirm-dialog.service';
import { ConfirmDialogModule } from './confirm-dialog/confirm-dialog.module';
import { HomeModule } from './home/home.module';
import { MenubarModule } from 'primeng/menubar';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { AutoFocusModule } from 'primeng/autofocus';
import { RouteReuseStrategy } from '@angular/router';
import { AppRouteReuseStrategy } from './app-route-reuse-strategy';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
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
    AiModelModule,
    AiModelCardModule,
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
    NgbModule,
    MenubarModule,
    DynamicDialogModule,
    AutoFocusModule
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
    ConfirmDialogService,
    { provide: RouteReuseStrategy, useClass: AppRouteReuseStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
