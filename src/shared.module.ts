import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule, Http, XHRBackend, RequestOptions } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { FrameModule } from './frame';
import { BoardcastService, MessagerService, PopupService, CustomHttp, CustomHttpProvider } from './services';


@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    FormsModule
  ],
  declarations: [],
  providers: [
    BoardcastService,
    MessagerService,
    PopupService,
    CustomHttpProvider
  ],
  exports: [
    FrameModule
  ]
})
export class SharedModule { }
