import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { ActionSheetController, AlertController, IonRouterOutlet, MenuController, Platform } from '@ionic/angular';
import { GlobalService } from './services/global.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from './services/api.service';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { File } from '@ionic-native/file/ngx';
import { AdmobfreeService } from './services/admobfree.service';
import { AppVersion } from '@ionic-native/app-version/ngx';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  @ViewChild(IonRouterOutlet) routerOutlet: IonRouterOutlet;
  alertInShown: boolean = true;
  internetPopup: any;

  constructor(
    public appVersion: AppVersion,
    private alertCtrl: AlertController,
    public menutCtrl: MenuController,
    public ac: ActionSheetController,
    private ref: ChangeDetectorRef,
    public gs: GlobalService,
    public platform: Platform,
    public router: Router,
    private _location: Location,
    private androidPermissions: AndroidPermissions,
    public api: ApiService,
    public admobS: AdmobfreeService,
    private file: File
  ) {
    this.platform.ready().then(async () => {
      this.platform.backButton.subscribeWithPriority(0, () => {
        console.log("this.router.url>>" + JSON.stringify(this.router.url));

        if (this.routerOutlet && this.routerOutlet.canGoBack() && this.router.url != '/tabs/home' && this.router.url != '/tabs/trending' && this.router.url != '/tabs/profile' && this.router.url != '/tabs/discover') {
          this.routerOutlet.pop();
        } else if (this.router.url) {
          if (this.router.url != '/tabs/home') {
            this.router.navigate(['/tabs/home']);
          } else {
            navigator['app'].exitApp();
          }
        }
      })

      this.gs.getLanguageList();
      this.getAppDetail();
      this.createUserProfile();


      this.file.createDir(this.file.externalRootDirectory, 'Download/FS Video Status', true).then((response) => {
      }).catch(err => {
        this.file.createDir(this.file.externalRootDirectory, 'Download/FS Video Status/Videos', true).then((result) => {
        }).catch((err) => { });

        this.file.createDir(this.file.externalRootDirectory, 'Download/FS Video Status/Quotes', true).then((result) => {
        }).catch((err) => { });
        console.log('Directory no create' + JSON.stringify(err));
      });

      this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.CAMERA, this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE, this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE]);
    });
  }

  getAppDetail() {
    this.api.post('getAppDetail', '').then((res) => {
      console.log(">>>>>>", res['ResultData']);

      // let data: any = { "FSVSBannerId": "ca-app-pub-3940256099942544/6300978111", "FSVSInterstitialId": "ca-app-pub-3940256099942544/1033173712", "isFSVSTestingAds": true, "isFSVSAdsShow": "0", "FSVSVersion": "0.0.1" }
      // data = JSON.stringify(data);
      // this.admobS.rendomAds = JSON.parse(data); // res['ResultData'].app_version (Add this here) 

      // console.log("adsShowOnCount>>>", this.admobS.rendomAds.adsShowOnCount);
      // App Update Use for Ads hide show 
      this.admobS.isAdsShow = res['ResultData'].app_update == "0" ? false : true;
      if (res['ResponseCode'] == 1) {
        this.appVersion.getVersionNumber().then((versionNumber) => {
          this.gs.crVersion = versionNumber;
          this.gs.appNewVersion = res['ResultData'].app_version;
          if (this.admobS.isAdsShow && this.admobS.rendomAds && this.admobS.rendomAds.FSVSBannerId) {
            this.admobS.preInteAds();
            this.admobS.adMobFreeBanner();
          }
          if (res['ResultData'].app_version != versionNumber) {
            this.updatePopup()
          }
        })
      } else {
        this.gs.messageToast('Something went wrong');
      }
    }, error => {
      console.log(JSON.stringify("error>>>>>>>>" + error));
      this.gs.messageToast('Something went wrong');
    })
  }

  async createUserProfile() {
    let LoginId = await JSON.parse(window.localStorage.getItem("FSVideostatusUuid")) || null;
    if (!LoginId) {
      this.gs.device_token = await this.uuidv4();
      window.localStorage.setItem("FSVideostatusUuid", JSON.stringify(this.gs.device_token));
    } else {
      this.gs.device_token = LoginId;
    }
    let body = {
      "device_token": this.gs.device_token
    }
    this.api.post('createUserProfile', body).then((res) => {
      if (res['ResponseCode'] == 1) {
        this.gs.userData = res['ResultData'] || {};
      } else {
        this.gs.messageToast('Something went wrong');
      }
    }, error => {
      this.gs.messageToast('Something went wrong');
    })
  }

  uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  async updatePopup() {
    const actionSheet = await this.ac.create({
      header: 'Enjoy New Version',
      mode: 'ios',
      buttons: [{
        text: 'Update Now',
        handler: () => {
          this.gs.rateApp();
        }
      }, {
        text: 'New v' + this.gs.appNewVersion,
        handler: () => {
          this.gs.rateApp();
        }
      }, {
        text: 'Update Later',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });

    await actionSheet.present();
  }

  privacyPolice() {
    this.router.navigate(['/privacy-police']);
    this.menutCtrl.close();
  }
  quotes() {
    this.router.navigate(['/quotes']);
    this.menutCtrl.close();
  }
}
