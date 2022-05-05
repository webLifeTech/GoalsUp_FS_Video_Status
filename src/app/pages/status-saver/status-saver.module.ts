import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StatusSaverPageRoutingModule } from './status-saver-routing.module';

import { StatusSaverPage } from './status-saver.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StatusSaverPageRoutingModule
  ],
  declarations: [StatusSaverPage]
})
export class StatusSaverPageModule {}
