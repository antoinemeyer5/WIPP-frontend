import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HomeComponent} from './home.component';
import {HomeRoutingModule} from './home.routing.module';
import {ImagesCollectionListComponent} from '../images-collection/images-collection-list/images-collection-list.component';
import {ImagesCollectionModule} from '../images-collection/images-collection.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MatTableModule} from '@angular/material';

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    //NgbModule.forRoot(),
    //MatTableModule,
    HomeRoutingModule,
    ImagesCollectionModule
  ],
  // entryComponents: [
  //   ImagesCollectionListComponent
  // ]
})
export class HomeModule { }
