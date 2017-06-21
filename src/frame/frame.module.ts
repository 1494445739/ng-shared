import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FrameComponent } from './frame.component';
import { HeaderComponent } from './header/header.component';
import { MenuComponent } from './menu/menu.component';
import { PopupModule } from '../popup';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    PopupModule
  ],
  declarations: [
    HeaderComponent,
    FrameComponent,
    MenuComponent
  ],
  exports: [
    HeaderComponent,
    FrameComponent,
    MenuComponent
  ]
})
export class FrameModule { }
