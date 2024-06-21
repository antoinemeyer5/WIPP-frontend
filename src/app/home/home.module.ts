import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HomeComponent} from './home.component';
import {HomeRoutingModule} from './home.routing.module';
import {ImagesCollectionModule} from '../images-collection/images-collection.module';

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    ImagesCollectionModule
  ]
})
export class HomeModule { }
