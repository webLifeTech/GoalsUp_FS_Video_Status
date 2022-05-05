import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonContent, IonSlides, ModalController, Platform } from '@ionic/angular';
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
  selector: 'app-status-saver-slide',
  templateUrl: './status-saver-slide.page.html',
  styleUrls: ['./status-saver-slide.page.scss'],
})
export class StatusSaverSlidePage implements OnInit {

  getVideoObj: any = {};
  getAllVideos: any = [];
  foldername: any;
  spinner: boolean = true;
  isShown: boolean = false;
  downloadspinner: boolean = false;
  isVidShare: boolean = false;
  shownVideos: number = 0;
  previousInd: any = 0;
  videoURL: any;
  isHideShowPlay: boolean = true;
  isAPIcall: boolean = true;
  setTimeout: any;
  endPoint: any = '';
  slideOpts = {
    loop: false,
    initialSlide: 0,
  };
  category: any;
  @ViewChild('isNewVideo') isNewVideo: ElementRef;
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
    public modalController: ModalController,
    public admobS: AdmobfreeService,
    // public adMobFree: AdMobFree,
    private statusBar: StatusBar
  ) {
    this.platform.ready().then(async () => {
      let getCatBioObj = await JSON.parse(this.route.snapshot.queryParamMap.get('item'));
      this.slideOpts.initialSlide = getCatBioObj.index;
      this.shownVideos = 0;
      this.previousInd = 0;
      this.spinner = false;
      // this.adMobFree.on(this.adMobFree.events.INTERSTITIAL_OPEN).subscribe(() => {
      //   let index = this.slides.getActiveIndex();
      //   console.log("index>>>>>>>>>>>>>>>>>" + index);

      //   setTimeout(() => {
      //     let newVideoData = <HTMLVideoElement>(
      //       document.getElementById("isNewVideo" + index)
      //     );
      //     console.log("newVideoData>>>>>" + JSON.stringify(newVideoData));

      //     if (newVideoData) {
      //       newVideoData.pause();
      //     }
      //   }, 100);
      // });
    })
  }

  ngOnInit() {
  }

  slideChanged() {
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
              document.getElementById("isNewVideo" + (index - 1))
            );
            if (newVideoData) {
              newVideoData.pause();
            }
          } else {
            let newVideoData = <HTMLVideoElement>(
              document.getElementById("isNewVideo" + (index + 1))
            );
            if (newVideoData) {
              newVideoData.pause();
            }
          }
          this.previousInd = index;

          let newVideoData = <HTMLVideoElement>(
            document.getElementById("isNewVideo" + index)
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
      console.log("iiiiii>>", index);
    });
  }
  slidePrevv() {
    this.slides.getActiveIndex().then((index) => {
      console.log("iiiiii>>", index);
    });
  }

  viaVideoShare(path, fileName) {
    this.admobS.rendomAdShow();
    this.isVidShare = true;
    this.socialSharing.share('', '', path + fileName, '').then((res) => {
      this.isVidShare = false;
    }, (er) => {
      this.isVidShare = false;
    });
  }

  share(fileName, isBusinessWP, isAndroid11?) {
    this.admobS.rendomAdShow();
    this.isVidShare = true;
    console.log(">>>>>>>share");
    let path = '';
    if (isBusinessWP) {
      path = this.file.externalRootDirectory + 'WhatsApp Business/Media/.Statuses/';
    } else {
      if (isAndroid11) {
        path = this.file.externalRootDirectory + '/Android/media/com.whatsapp/WhatsApp/Media/';
      } else {
        path = this.file.externalRootDirectory + 'WhatsApp/Media/.Statuses/';
      }
    }
    console.log("path>>>>>>>>>>" + path + fileName);
    this.socialSharing.share('', '', path + fileName, '').then((res) => {
      this.isVidShare = false;
    }, (er) => {
      console.log('error on sharing' + JSON.stringify(er));
      this.isVidShare = false;
    });
  }

  download(fileNM, isBusinessWP, isAndroid11?) {
    console.log(">>>>>>" + fileNM + ',' + isBusinessWP + ',' + isAndroid11);

    this.admobS.rendomAdShow();
    this.downloadspinner = true;
    let path = '';
    if (isBusinessWP) {
      path = this.file.externalRootDirectory + 'WhatsApp Business/Media/.Statuses/';
    } else {
      if (isAndroid11) {
        path = this.file.externalRootDirectory + '/Android/media/com.whatsapp/WhatsApp/Media/.Statuses/';
      } else {
        path = this.file.externalRootDirectory + 'WhatsApp/Media/.Statuses/';
      }
    }

    console.log("path>>>" + path);

    let fileName = new Date().getTime() + '.mp4';
    // if (isImage) {
    //   fileName = new Date().getTime() + '.jpg';
    // } else {
    //   fileName = new Date().getTime() + '.mp4';
    // }
    const fileTransfer: FileTransferObject = this.fileTransfer.create();
    const fileTransferDir = this.file.externalRootDirectory;
    let fileURL = '';
    fileURL = fileTransferDir + 'Download/FS Video Status/Videos/' + fileName;
    // path.mkdirs();
    fileTransfer.download(path + fileNM, fileURL).then((entry) => {
      console.log("entryentryentryentryentryentryentry");
      this.downloadspinner = false;
      setTimeout(() => {
        let alert = this.alertCtrl.create({
          header: 'FS Video Status',
          message: 'Download Successfully!',
          mode: 'ios',
          backdropDismiss: false,
          buttons: [
            {
              text: 'Ok',
              handler: () => {
                (<any>window).cordova.plugins.MediaScannerPlugin.scanFile(fileURL, () => { },
                  (errr) => { }
                );
                // setTimeout(() => {
                //   this.ads.randomAdsShow();
                // }, 200);
              },
            },
          ],
        });
        alert.then((res) => {
          res.present();
        });
      }, 200);
    }, (error) => {
      this.downloadspinner = false;
      console.log('error on download' + JSON.stringify(error));
    }
    );
  }

}
