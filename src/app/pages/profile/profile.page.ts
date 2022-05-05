import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonContent } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { GlobalService } from 'src/app/services/global.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { AdmobfreeService } from 'src/app/services/admobfree.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  profileFeed: any = 'myvideo';
  allMyVideos: any = {
    videoData: []
  };
  isVidShare: boolean = false;
  isAPIcall: boolean = true;
  dataStart: any = 0;
  isShown: boolean = false;
  isSpinner: boolean = false;
  @ViewChild(IonContent, { static: false }) content: IonContent;
  constructor(
    public alertController: AlertController,
    public gs: GlobalService,
    public api: ApiService,
    public socialSharing: SocialSharing,
    public router: Router,
    public admobS: AdmobfreeService,
  ) {
    if (this.gs.userData && this.gs.userData.user_id) {
      this.getMyVideos();
    }
    // console.log("gs.myFavVideos>>>", gs.myFavVideos);
    // console.log("this.userData", this.gs.userData);
  }

  ngOnInit() {
  }

  getMyVideos() {
    this.isSpinner = true;
    let body = {
      user_id: this.gs.userData.user_id,
      start: this.allMyVideos.videoData.length
    }
    this.api.post('getMyVideos', body).then((res) => {
      this.isSpinner = false;
      if (res['ResponseCode'] == 1) {
        this.allMyVideos = res['ResultData'];
        console.log("this.allCategoryList>>>>", this.allMyVideos);
      } else {
        this.gs.messageToast('Something went wrong');
      }
    }, err => {
      this.gs.messageToast('Something went wrong');
    })
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

  loadData(infiniteScroll) {
    if (this.isAPIcall && this.profileFeed == 'myvideo') {
      let body = {
        user_id: this.gs.userData.user_id,
        start: this.allMyVideos.videoData.length
      }
      this.api.post('getMyVideos', body).then((res) => {
        console.log("res>>>>", res);
        if (res['ResponseCode'] == 1) {
          if (res['ResultData'] && res['ResultData']['videoData'] && res['ResultData']['videoData'].length) {
            for (let i = 0; i < res['ResultData']['videoData'].length; i++) {
              this.allMyVideos.videoData.push(res['ResultData']['videoData'][i]);
            }
          } else {
            this.isAPIcall = false;
          }
          infiniteScroll.target.complete();
        } else {
          infiniteScroll.target.complete();
          this.gs.messageToast('Something went wrong');
        }
      }, err => {
        infiniteScroll.target.complete();
        this.gs.messageToast('Something went wrong');
      })
      return true;
    }
    infiniteScroll.target.complete();
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

  editProfile() {
    this.router.navigate(['/login']);
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

  login() {
    this.router.navigate(['/login']);
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

  uploadVideo() {
    this.admobS.rendomAdShow();
    this.router.navigate(['/upload']);
  }

  addFaverite() {
    this.admobS.rendomAdShow();
    this.router.navigate(['/tabs/home']);
  }

}
