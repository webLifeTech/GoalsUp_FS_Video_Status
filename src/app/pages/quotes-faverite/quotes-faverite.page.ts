import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonContent } from '@ionic/angular';
import { GlobalService } from 'src/app/services/global.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Router } from '@angular/router';
import { AdmobfreeService } from 'src/app/services/admobfree.service';

@Component({
  selector: 'app-quotes-faverite',
  templateUrl: './quotes-faverite.page.html',
  styleUrls: ['./quotes-faverite.page.scss'],
})
export class QuotesFaveritePage implements OnInit {
  isVidShare: boolean = false;
  isShown: boolean = false;
  @ViewChild(IonContent, { static: false }) content: IonContent;
  constructor(
    public gs: GlobalService,
    public socialSharing: SocialSharing,
    public router: Router,
    public alertController: AlertController,
    public admobS: AdmobfreeService,
  ) { }

  ngOnInit() {
  }

  viaVideoShare(quotRow) {
    this.admobS.rendomAdShow();
    this.isVidShare = true;
    this.socialSharing.share(
      '',
      '',
      quotRow.quotes_thumb,
      ''
    ).then((res) => {
      this.isVidShare = false;
      quotRow.quotes_share = Number(quotRow.quotes_share) + 1;
      this.gs.increateCount(quotRow.quotes_id, "2");
    }, (er) => {
      this.isVidShare = false;
    });
  }


  async unFavConfirm(quotRow) {
    const alert = await this.alertController.create({
      header: 'Alert !',
      message: 'Are you sure you want to unfavourite',
      mode: 'ios',
      cssClass: 'alert_ctrl',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Unfavourite',
          cssClass: 'danger-btn',
          handler: () => {
            this.gs.removeFavQuotes(quotRow);
            console.log('Confirm Okay');
          }
        }
      ]
    });
    await alert.present();
  }

  goQuotesSlides(data, index) {
    this.router.navigate(['/quotes-slider'], {
      queryParams: {
        item: JSON.stringify({
          quotesData: data,
          index: index,
        })
      }
    });
  }

  onScroll(event) {
    if (event.detail.scrollTop > 300) {
      this.isShown = true;
    } else {
      this.isShown = false;
    }
  }

  scrollToTop() {
    this.content.scrollToTop(400);
  }
}
