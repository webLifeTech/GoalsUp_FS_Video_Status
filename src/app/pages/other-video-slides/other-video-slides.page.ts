import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonContent, IonSlides, ModalController, NavController, NavParams, Platform } from '@ionic/angular';
import { GlobalService } from '../../services/global.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { ApiService } from 'src/app/services/api.service';
// import { AdMobFree } from '@ionic-native/admob-free/ngx';
import { AdmobfreeService } from 'src/app/services/admobfree.service';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { OtherProfilePage } from '../other-profile/other-profile.page';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-other-video-slides',
  templateUrl: './other-video-slides.page.html',
  styleUrls: ['./other-video-slides.page.scss'],
})
export class OtherVideoSlidesPage implements OnInit {
  getVideoObj: any = {};
  getAllProfileVideos: any = [];
  foldername: any;
  spinner: boolean = true;
  isShown: boolean = false;
  downloadspinner: boolean = false;
  isVidShare: boolean = false;
  shownVideos: number = 0;
  previousInd: any = 0;
  videoURL: any;
  isPlay: boolean = true;
  isHideShowPlay: boolean = true;
  isAPIcall: boolean = true;
  setTimeout: any;
  endPoint: any = '';
  proSlideOpts = {
    initialSlide: 0,
    direction: 'vertical',
  };
  category: any;
  user_id: any;
  @ViewChild('isProVideo') isProVideo: ElementRef;
  @ViewChild(IonContent, { static: false }) content: IonContent;
  @ViewChild(IonSlides) slides: IonSlides;
  constructor(
    public router: Router,
    public alertCtrl: AlertController,
    public fileTransfer: FileTransfer,
    public file: File,
    public gs: GlobalService,
    private route: ActivatedRoute,
    public socialSharing: SocialSharing,
    public api: ApiService,
    private platform: Platform,
    // public navParams: NavParams,
    public modalController: ModalController,
    public navCtrl: NavController,
    public admobS: AdmobfreeService,
    // public adMobFree: AdMobFree,
    private statusBar: StatusBar
  ) {
    this.platform.ready().then(async () => {
      let getVdeioByNpObj = await JSON.parse(this.route.snapshot.queryParamMap.get('item'));
      // let getVdeioByNpObj = await this.navParams.get('item');
      this.proSlideOpts.initialSlide = getVdeioByNpObj.index;
      this.getAllProfileVideos = getVdeioByNpObj.videoData;
      this.endPoint = getVdeioByNpObj.endPoint;
      this.user_id = getVdeioByNpObj.user_id;
      this.shownVideos = 0;
      this.previousInd = 0;
      this.spinner = false;
      // this.adMobFree.on(this.adMobFree.events.INTERSTITIAL_OPEN).subscribe(() => {
      //   let index = this.slides.getActiveIndex();
      //   console.log("index>>>>>>>>>>>>>>>>>" + index);
      //   setTimeout(() => {
      //     let newVideoData = <HTMLVideoElement>(
      //       document.getElementById("isProVideo" + index)
      //     );
      //     if (newVideoData) {
      //       newVideoData.pause();
      //     }
      //   }, 100);
      // });
      this.gs.checkFavVideo(this.getAllProfileVideos[getVdeioByNpObj.index].video_id);
    })
  }

  ngOnInit() {
    setTimeout(() => {
      let newVideoData = <HTMLVideoElement>document.getElementById("isProVideo" + 0);
      console.log("newVideoData???", newVideoData);
      if (newVideoData) {
        // newVideoData.play();
      }
      this.isPlay = false;
    }, 50);
  }

  loadMoreData() {
    console.log("shownVideos>>>", this.shownVideos);
    if (this.shownVideos < this.getAllProfileVideos.length) {
      this.shownVideos += 5;
      this.admobS.rendomAdShow();
    }
  }

  slideChanged() {
    this.isPlay = false;
    try {
      (<any>window).document.querySelectorAll('video').forEach(vid => {
        vid.pause();
        vid.currentTime = 0;
      });

      this.slides.getActiveIndex().then((index) => {
        if (index == 1) {
          this.shownVideos += 1;
        }
        setTimeout(() => {
          if (index > this.previousInd) {
            let newVideoData = <HTMLVideoElement>(
              document.getElementById("isProVideo" + (index - 1))
            );
            if (newVideoData) {
              newVideoData.pause();
            }
          } else {
            let newVideoData = <HTMLVideoElement>(
              document.getElementById("isProVideo" + (index + 1))
            );
            if (newVideoData) {
              newVideoData.pause();
            }
          }
          this.previousInd = index;

          let newVideoData = <HTMLVideoElement>(
            document.getElementById("isProVideo" + index)
          );
          if (newVideoData) {
            newVideoData.play();
          }
        }, 100);
      });

    } catch (ee) {
    }
  }

  slideNextt() {
    console.log("index");
    this.slides.getActiveIndex().then((index) => {
      if (this.isAPIcall && (index == this.getAllProfileVideos.length - 3)) {
        this.loadData();
      }
      this.gs.checkFavVideo(this.getAllProfileVideos[index].video_id);
    });
  }
  slidePrevv() {
    this.slides.getActiveIndex().then((index) => {
      console.log("iiiiii>>", index);
      this.gs.checkFavVideo(this.getAllProfileVideos[index].video_id);
    });
  }

  // loadData() {
  //   if (this.isAPIcall && this.endPoint != '') {
  //     let body;
  //     if (this.endPoint == 'getTrendingVideos' || this.endPoint == 'getHomePageVideoList') {
  //       body = {
  //         language_id: String(this.gs.selectedLang),
  //         start: this.getAllProfileVideos.length
  //       }
  //     }
  //     if (this.endPoint == 'getVideoListByCategory') {
  //       body = {
  //         category_id: this.category,
  //         language_id: String(this.gs.selectedLang),
  //         start: this.getAllProfileVideos.length,
  //       }
  //     }
  //     setTimeout(() => {
  //       this.api.post(this.endPoint, body).then((res) => {
  //         console.log("res>>>", res);
  //         console.log("this.getAllProfileVideos>>>", this.getAllProfileVideos);
  //         if (res['ResponseCode'] == 1) {
  //           if (res['ResultData'].length) {
  //             for (let i = 0; i < res['ResultData'].length; i++) {
  //               this.getAllProfileVideos.push(res['ResultData'][i]);
  //             }
  //           } else {
  //             this.isAPIcall = false;
  //           }
  //         } else {
  //           this.gs.messageToast('Something went wrong');
  //         }
  //       }, err => {
  //         this.gs.messageToast('Something went wrong');
  //       })
  //     }, 100);
  //   }
  // }

  loadData() {
    if (this.isAPIcall) {
      let body = {
        user_id: this.user_id,
        start: this.getAllProfileVideos.length
      }
      this.api.post('getMyVideos', body).then((res) => {
        if (res['ResponseCode'] == 1) {
          if (res['ResultData'] && res['ResultData']['videoData'] && res['ResultData']['videoData'].length) {
            for (let i = 0; i < res['ResultData']['videoData'].length; i++) {
              this.getAllProfileVideos.push(res['ResultData']['videoData'][i]);
            }
          } else {
            this.isAPIcall = false;
          }
        } else {
          this.gs.messageToast('Something went wrong');
        }
      }, err => {
        this.gs.messageToast('Something went wrong');
      })
      return true;
    }
  }


  downloadVideo(vidRow) {
    this.downloadspinner = true;
    var fileName = '4kVideoStatus' + new Date().getTime() + '.mp4';
    const fileTransfer: FileTransferObject = this.fileTransfer.create();
    const fileTransferDir = this.file.externalRootDirectory;
    console.log("fileTransferDir<<<<<<<<<>>>>" + JSON.stringify(fileTransferDir));
    const fileURL = fileTransferDir + 'Download/FS Video Status/Videos/' + fileName;
    fileTransfer.download(vidRow.video_url, fileURL).then((entry) => {
      this.downloadspinner = false;
      vidRow.video_download = Number(vidRow.video_download) + 1;
      this.gs.increateCount(vidRow.video_id, "1");
      let alert = this.alertCtrl.create({
        header: 'FS Video Status',
        message: 'Download Successfully!',
        mode: 'ios',
        cssClass: 'my_alertCtrl',
        buttons: [
          {
            text: 'Ok',
            cssClass: 'oky_btn',
            handler: () => {
              // this.admobS.showInterstitialAds();
              (<any>window).cordova.plugins.MediaScannerPlugin.scanFile(fileURL, () => { },
                (errr) => { }
              );
            },
          },
        ],
      });
      alert.then((res) => {
        res.present();
      });
    },
      (error) => {
        console.log("error>>>>>>>>>>>>>" + JSON.stringify(error));
        this.downloadspinner = false;
      }
    );
  }

  viaVideoShare(vidRow) {
    this.isVidShare = true;
    this.socialSharing.share('', '', vidRow.video_url, '').then((res) => {
      this.isVidShare = false;
      vidRow.video_share = Number(vidRow.video_share) + 1;
      this.gs.increateCount(vidRow.video_id, "2");
    }, (er) => {
      this.isVidShare = false;
    });
  }

  async viewProfile(user_id) {
    this.dismiss();
    // this.slides.getActiveIndex().then((index) => {
    //   let newVideoData = <HTMLVideoElement>(
    //     document.getElementById("isProVideo" + index)
    //   );
    //   if (newVideoData) {
    //     newVideoData.pause();
    //   }
    // })
    // this.router.navigate(['/other-profile'], {
    //   queryParams: {
    //     user_id: user_id
    //   }
    // });
    // const modal = await this.modalController.create({
    //   component: OtherProfilePage,
    //   cssClass: 'my-custom-class',
    //   componentProps: {
    //     user_id: user_id
    //   }
    // });
    // return await modal.present();
  }
  dismiss() {
    this.slides.getActiveIndex().then((index) => {
      let newVideoData = <HTMLVideoElement>(
        document.getElementById("isProVideo" + index)
      );
      if (newVideoData) {
        newVideoData.pause();
      }
    })
    this.modalController.dismiss({
      'dismissed': true
    });
  }
}
