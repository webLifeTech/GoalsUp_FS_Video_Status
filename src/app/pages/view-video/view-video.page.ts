import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonContent, IonSlides, ModalController, Platform } from '@ionic/angular';
import { GlobalService } from '../../services/global.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { ApiService } from 'src/app/services/api.service';
import { AdMobFree } from '@ionic-native/admob-free/ngx';
import { AdmobfreeService } from 'src/app/services/admobfree.service';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { OtherProfilePage } from '../other-profile/other-profile.page';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-view-video',
  templateUrl: './view-video.page.html',
  styleUrls: ['./view-video.page.scss'],
})
export class ViewVideoPage implements OnInit {

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
    direction: 'vertical',
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
    public adMobFree: AdMobFree,
    private statusBar: StatusBar
  ) {
    this.platform.ready().then(async () => {
      let getCatBioObj = await JSON.parse(this.route.snapshot.queryParamMap.get('item'));
      this.slideOpts.initialSlide = getCatBioObj.index;
      this.shownVideos = 0;
      this.previousInd = 0;
      this.spinner = false;
      this.adMobFree.on(this.adMobFree.events.INTERSTITIAL_OPEN).subscribe(() => {
        let index = this.slides.getActiveIndex();
        console.log("index>>>>>>>>>>>>>>>>>" + index);

        setTimeout(() => {
          let newVideoData = <HTMLVideoElement>(
            document.getElementById("isNewVideo" + index)
          );
          console.log("newVideoData>>>>>" + JSON.stringify(newVideoData));
          if (newVideoData) {
            newVideoData.pause();
          }
        }, 100);
      });
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
        // if (index == 1) {
        //   this.shownVideos += 1;
        // }

        if (this.shownVideos == 2) {
          this.admobS.rendomAdShow();
          this.shownVideos = 0;
        } else {
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

  viaVideoShare(vidRow) {
    this.isVidShare = true;
    this.socialSharing.share('', '', vidRow.original, '').then((res) => {
      this.isVidShare = false;
    }, (er) => {
      this.isVidShare = false;
    });
  }

}
