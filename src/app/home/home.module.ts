import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HomeComponent} from './home.component';
import {HomeRoutingModule} from './home.routing.module';
import {ImagesCollectionModule} from '../images-collection/images-collection.module';
import {TableModule} from 'primeng/table';
import {CardModule} from 'primeng/card';
import {SplitterModule} from 'primeng/splitter';
import {ButtonModule} from 'primeng/button';

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    ImagesCollectionModule,
    TableModule,
    CardModule,
    SplitterModule,
    ButtonModule
  ]
})
export class HomeModule { }
