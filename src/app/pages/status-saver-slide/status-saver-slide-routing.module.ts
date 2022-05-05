import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StatusSaverSlidePage } from './status-saver-slide.page';

const routes: Routes = [
  {
    path: '',
    component: StatusSaverSlidePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StatusSaverSlidePageRoutingModule {}
