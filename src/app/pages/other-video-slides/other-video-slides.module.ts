import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OtherVideoSlidesPageRoutingModule } from './other-video-slides-routing.module';

import { OtherVideoSlidesPage } from './other-video-slides.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OtherVideoSlidesPageRoutingModule
  ],
  declarations: [OtherVideoSlidesPage]
})
export class OtherVideoSlidesPageModule {}
