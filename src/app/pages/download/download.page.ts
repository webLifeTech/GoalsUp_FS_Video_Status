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
  selector: 'app-download',
  templateUrl: './download.page.html',
  styleUrls: ['./download.page.scss'],
})
export class DownloadPage implements OnInit {
  wholeVideos: any = [];
  isSpinner: boolean = true;
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
    //     myVideosDownload
    // myQuotesDownload
    this.gs.myQuotesDownload = [];
    this.gs.myVideosDownload = [];
    this.gs.presentLoading('Please wait...');
    this.readVideoFromFolder(this.file.externalRootDirectory, 'Download/FS Video Status/Videos/');
    this.readImageFromFolder(this.file.externalRootDirectory, 'Download/FS Video Status/Quotes/');
  }

  ngOnInit() {
    // this.gs.myQuotesDownload = [];
  }

  ionViewWillEnter() {
  }

  segmentChanged($event) {
    console.log("downloadTab>>", this.downloadTab);
  }

  readVideoFromFolder(path, dirName) {
    this.file.listDir(path, dirName).then(async (entries) => {

      let count = 0;
      const getFileInfo = async () => {
        if (count < entries.length) {
          this.file.resolveLocalFilesystemUrl(entries[count]['nativeURL']).then((fileEntry) => {
            fileEntry.getMetadata((fileObj) => {
              entries[count]['date'] = fileObj['modificationTime'];
              count += 1;
              getFileInfo();
            });
          }).catch((e) => {
            console.log('resolveLocalFilesystemUrl>>>' + JSON.stringify(e));
            this.isSpinner = false;
            this.gs.dissmisLoding();
          });;
        } else {
          let wholeWPVideo = await this.sortByKeyDesc(entries, 'date');
          wholeWPVideo.forEach((ff, index) => {
            this.wholeVideos.push({
              name: ff.name,
              path: path + dirName,
              original: ff.nativeURL
            });
          });
          console.log('wholeWPVideo>>>' + JSON.stringify(wholeWPVideo));
        }
      };
      await getFileInfo();
      setTimeout(() => {
        this.createThumbnail();
      }, 300);
    }).catch((e) => {
      console.log('While reading pdf getting errors' + JSON.stringify(e));
      this.isSpinner = false;
      this.gs.dissmisLoding();
    });
  }

  readImageFromFolder(path, dirName) {
    this.file.listDir(path, dirName).then(async (entries) => {
      let count = 0;
      const getFileInfo = async () => {
        if (count < entries.length) {
          this.file.resolveLocalFilesystemUrl(entries[count]['nativeURL']).then((fileEntry) => {
            fileEntry.getMetadata((fileObj) => {
              entries[count]['date'] = fileObj['modificationTime'];
              count += 1;
              getFileInfo();
            });
          }).catch((e) => {
            console.log('resolveLocalFilesystemUrl>>>' + JSON.stringify(e));
            this.isSpinner = false;
            this.gs.dissmisLoding();
          });;
        } else {
          let wholeImage = await this.sortByKeyDescImg(entries, 'date');
          wholeImage.forEach((ff, index) => {
            this.gs.myQuotesDownload.push({
              image: this.getQtImg(ff.nativeURL),
              original: ff.nativeURL
            });
          });
          console.log('wholeImage>>>' + JSON.stringify(wholeImage));
        }
      };
      await getFileInfo();

      // for (let i of entries) {
      //   let image = (window as any).Ionic.WebView.convertFileSrc(i['nativeURL']);
      //   this.gs.myQuotesDownload.push({ image: image, original: i['nativeURL'] });
      // }
      console.log(" this.gs.myQuotesDownload>>>>>>" + JSON.stringify(this.gs.myQuotesDownload));
    }).catch((e) => {
      console.log('While reading pdf getting errors' + JSON.stringify(e));
    });
  }

  createThumbnail() {
    if (this.wholeVideos.length) {
      this.videoEditor.createThumbnail({
        fileUri: this.wholeVideos[this.indexeeee].path + '/' + this.wholeVideos[this.indexeeee].name,
        outputFileName: this.wholeVideos[this.indexeeee].name.split('.').shift(),
        atTime: 1,
        height: 200,
        quality: 100,
      }).then((thumbnail) => {
        //get dataUrl
        let tempPath = thumbnail.split('/');
        let thumbName = tempPath.pop();
        let pathToThumb = 'file://' + tempPath.join('/') + '/';
        this.file.readAsDataURL(pathToThumb, thumbName).then((vidThumb) => {
          var data = {
            video: this.getTrustImg(
              this.wholeVideos[this.indexeeee].path + '/' + this.wholeVideos[this.indexeeee].name
            ),
            thumb: vidThumb,
            name: this.wholeVideos[this.indexeeee].name,
            original: this.wholeVideos[this.indexeeee].nativeURL,
          };
          this.gs.myVideosDownload.push(data);
          console.log("this.gs.myVideosDownload>>>>>>" + JSON.stringify(this.gs.myVideosDownload));
          if (this.wholeVideos.length > this.indexeeee + 1) {
            this.indexeeee++;
            this.createThumbnail();
          } else {
            this.isSpinner = false;
            this.gs.dissmisLoding();
          }
        }).catch((err) => {
          console.log(err);
          this.isSpinner = false;
          this.gs.dissmisLoding();
        });
      }, (error) => {
        console.log('error>>>>>>>>>>>>>>>>>>>>>>>>>>>' + error);
        this.isSpinner = false;
        this.gs.dissmisLoding();
      });
    } else {
      this.isSpinner = false;
      this.gs.dissmisLoding();
      console.log("++++++++++++++++++++++++++");
    }
  }

  //status saver method
  sortByKeyDesc = (array, key) => {
    return array.sort((a, b) => {
      let x = a[key];
      let y = b[key];
      return x > y ? -1 : x < y ? 1 : 0;
    });
  };
  //status saver method
  sortByKeyDescImg = (array, key) => {
    return array.sort((a, b) => {
      let x = a[key];
      let y = b[key];
      return x > y ? -1 : x < y ? 1 : 0;
    });
  };

  getTrustImg(imageSrc) {
    const path = (<any>window).Ionic.WebView.convertFileSrc(imageSrc);
    return path;
  }
  getQtImg(imageSrc) {
    const path = (<any>window).Ionic.WebView.convertFileSrc(imageSrc);
    return path;
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
    this.router.navigate(['/view-video'], {
      queryParams: {
        item: JSON.stringify({
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
