import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonContent } from '@ionic/angular';
import { GlobalService } from 'src/app/services/global.service';
import { File } from '@ionic-native/file/ngx';
import { VideoEditor } from '@ionic-native/video-editor/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { AdmobfreeService } from 'src/app/services/admobfree.service';
// import { AdMobFree } from '@ionic-native/admob-free/ngx';

@Component({
  selector: 'app-status-saver',
  templateUrl: './status-saver.page.html',
  styleUrls: ['./status-saver.page.scss'],
})
export class StatusSaverPage implements OnInit {
  wholeVideos: any = [];
  // isSpinner: boolean = true;
  isVidShare: boolean = false;
  downloadTab: any = 'videos';
  indexeeee: any = 0;
  isShown: boolean = false;
  @ViewChild(IonContent, { static: false }) content: IonContent;
  constructor(
    public gs: GlobalService,
    public router: Router,
    private file: File,
    private videoEditor: VideoEditor,
    public alertController: AlertController,
    public socialSharing: SocialSharing,
    public admobS: AdmobfreeService,
    // public adMobFree: AdMobFree,
  ) {
    this.gs.presentLoading('Please wait...');
  }

  ngOnInit() {
    // this.gs.myQuotesDownload = [];
  }

  ionViewWillEnter() {
  }

  segmentChanged($event) {
    console.log("downloadTab>>", this.downloadTab);
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

  async delete(msg, index) {
    const alert = await this.alertController.create({
      header: 'Alert !',
      message: 'Are you sure you want to delete',
      mode: 'ios',
      cssClass: 'alert_ctrl',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'cancel_btn',
          handler: () => {
            console.log('Cancel clicked');
          },
        },
        {
          text: 'Yes',
          cssClass: 'danger-btn',
          handler: () => {
            this.admobS.rendomAdShow();
            if (msg == 'image') {
              var path = this.gs.myQuotesDownload[index].original;
              this.gs.myQuotesDownload.splice(index, 1);
            } else {
              var path = this.gs.myVideosDownload[index].original;
              this.gs.myVideosDownload.splice(index, 1);
            }
            var ind = path.indexOf(path.split('/').pop());
            var filepath = path.substring(0, ind);
            var fileName = path.split('/').pop();
            this.file.removeFile(filepath, fileName).then(() => {
            }).catch((e) => console.log('delete', JSON.stringify(e)));
          },
        },
      ],
    });
    await alert.present();
  }

  goQuotesSlides(index) {
    this.router.navigate(['/view-quotes'], {
      queryParams: {
        item: JSON.stringify({
          index: index,
        })
      }
    });
  }

  goVideoSlides(index) {
    this.router.navigate(['/status-saver-slide'], {
      queryParams: {
        item: JSON.stringify({
          index: index,
        })
      }
    });
  }

  // goWpStatus(index) {
  //   this.router.navigate(['/status-saver-slide'], {
  //     queryParams: {
  //       item: JSON.stringify({
  //         index: index,
  //       })
  //     }
  //   });
  // }

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