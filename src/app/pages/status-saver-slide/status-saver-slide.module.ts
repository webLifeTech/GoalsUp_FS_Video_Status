import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StatusSaverSlidePageRoutingModule } from './status-saver-slide-routing.module';

import { StatusSaverSlidePage } from './status-saver-slide.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StatusSaverSlidePageRoutingModule
  ],
  declarations: [StatusSaverSlidePage]
})
export class StatusSaverSlidePageModule {}
