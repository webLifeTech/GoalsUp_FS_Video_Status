import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonContent } from '@ionic/angular';
import { GlobalService } from 'src/app/services/global.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Router } from '@angular/router';
import { AdmobfreeService } from 'src/app/services/admobfree.service';

@Component({
  selector: 'app-faverite',
  templateUrl: './faverite.page.html',
  styleUrls: ['./faverite.page.scss'],
})
export class FaveritePage implements OnInit {
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

  viaVideoShare(vidRow) {
    this.admobS.rendomAdShow();
    this.isVidShare = true;
    this.socialSharing.share('', '', vidRow.video_url, '').then((res) => {
      this.isVidShare = false;
      vidRow.video_share = Number(vidRow.video_share) + 1;
      this.gs.increateCount(vidRow.video_id, "2");
    }, (er) => {
      this.isVidShare = false;
    });
  }


  async unFavConfirm(video_id) {
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
            this.gs.removeFavVideo(video_id);
            console.log('Confirm Okay');
          }
        }
      ]
    });
    await alert.present();
  }

  goVideoSlides(data, index) {
    this.router.navigate(['/video-slides'], {
      queryParams: {
        item: JSON.stringify({
          videoData: data,
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
