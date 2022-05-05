import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OtherVideoSlidesPage } from './other-video-slides.page';

const routes: Routes = [
  {
    path: '',
    component: OtherVideoSlidesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OtherVideoSlidesPageRoutingModule {}
