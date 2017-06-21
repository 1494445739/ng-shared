import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupComponent } from './popup.component';

import {
  ButtonModule,
  DialogModule
} from 'primeng/primeng';

@NgModule({
  imports: [
    CommonModule,
    ButtonModule,
    DialogModule
  ],
  declarations: [PopupComponent],
  exports: [PopupComponent]
})
export class PopupModule { }
