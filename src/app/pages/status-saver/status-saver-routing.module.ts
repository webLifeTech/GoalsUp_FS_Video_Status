import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StatusSaverPage } from './status-saver.page';

const routes: Routes = [
  {
    path: '',
    component: StatusSaverPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StatusSaverPageRoutingModule {}
