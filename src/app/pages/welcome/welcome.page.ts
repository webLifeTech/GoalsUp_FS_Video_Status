import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdmobfreeService } from '../../services/admobfree.service';
import { GlobalService } from '../../services/global.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {

  constructor(
    public gs: GlobalService,
    public router: Router,
    public admobS: AdmobfreeService,
    public adsService: AdmobfreeService,
  ) {
  }

  ngOnInit() {
  }

  save() {
    let findDuplicates = this.gs.allVideoLanguage.filter((item, index) => item.isChecked == true)

    console.log("findDuplicates>>>", findDuplicates);

    if (!findDuplicates.length) {
      this.gs.messageToast('Please select video status languages');
      return;
    }
    this.gs.selectedLang = [];
    for (let i in this.gs.allVideoLanguage) {
      if (this.gs.allVideoLanguage[i].isChecked) {
        this.gs.selectedLang.push(this.gs.allVideoLanguage[i].language_id);
      }
    }
    // this.admobS.rendomAdShow();
    this.admobS.showInterstitialAds();


    if (this.gs.selectedLang.length) {
      window.localStorage.setItem("selectedLanguages", JSON.stringify(this.gs.selectedLang));
      this.gs.getHomeVideos({
        language_id: String(this.gs.selectedLang),
        start: 0
      });
      console.log("<<", this.gs.selectedLang);
      this.router.navigate(['/tabs'])
    }
  }

}
