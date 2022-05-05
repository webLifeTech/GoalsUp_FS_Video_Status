import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonContent, ModalController, NavParams } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { GlobalService } from 'src/app/services/global.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { OtherVideoSlidesPage } from '../other-video-slides/other-video-slides.page';
import { AdmobfreeService } from 'src/app/services/admobfree.service';

@Component({
  selector: 'app-other-profile',
  templateUrl: './other-profile.page.html',
  styleUrls: ['./other-profile.page.scss'],
})
export class OtherProfilePage implements OnInit {

  profileFeed: any = 'myvideo';
  allMyVideos: any = {
    videoData: []
  };
  isVidShare: boolean = false;
  isAPIcall: boolean = true;
  dataStart: any = 0;
  user_id: any;
  isShown: boolean = false;
  @ViewChild(IonContent, { static: false }) content: IonContent;

  constructor(
    public alertController: AlertController,
    public gs: GlobalService,
    public api: ApiService,
    public socialSharing: SocialSharing,
    private route: ActivatedRoute,
    public router: Router,
    // public navParams: NavParams,
    public admobS: AdmobfreeService,
    public modalController: ModalController
  ) {
    // console.log(this.navParams.get('user_id'));
    this.user_id = JSON.parse(this.route.snapshot.queryParamMap.get('user_id'));
    // this.user_id = this.navParams.get('user_id');
    if (this.user_id) {
      this.getMyVideos(this.user_id);
    }
  }

  ngOnInit() {
  }

  getMyVideos(user_id) {
    let body = {
      user_id: user_id,
      start: this.allMyVideos.videoData.length
    }
    this.api.post('getMyVideos', body).then((res) => {
      if (res['ResponseCode'] == 1) {
        this.allMyVideos = res['ResultData'];
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
    if (this.isAPIcall) {
      let body = {
        user_id: this.user_id,
        start: this.allMyVideos.videoData.length
      }
      this.api.post('getMyVideos', body).then((res) => {
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

  async goVideoSlides(index) {
    this.admobS.rendomAdShow();
    this.router.navigate(['/other-video-slides'], {
      queryParams: {
        item: JSON.stringify({
          videoData: this.allMyVideos.videoData,
          index: index,
          user_id: this.allMyVideos.userProfile.user_id,
        })
      }
    });

    console.log("index>>>", index);


    // const modal = await this.modalController.create({
    //   component: OtherVideoSlidesPage,
    //   cssClass: 'my-custom-class',
    //   componentProps: {
    //     item: {
    //       videoData: this.allMyVideos.videoData,
    //       index: index,
    //       user_id: this.allMyVideos.userProfile.user_id,
    //     }
    //   }
    // });
    // return await modal.present();
  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
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
