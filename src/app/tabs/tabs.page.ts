import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AdmobfreeService } from '../services/admobfree.service';
import { GlobalService } from '../services/global.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(
    public router: Router,
    public gs: GlobalService,
    public admobS: AdmobfreeService,
  ) { }

  upload() {
    if (this.gs.userData && this.gs.userData.user_id) {
      this.admobS.rendomAdShow();
      this.router.navigate(['/upload']);
    } else {
      this.router.navigate(['/login']);
    }
  }

}
