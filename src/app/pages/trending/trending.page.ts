import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { AdmobfreeService } from 'src/app/services/admobfree.service';
import { ApiService } from 'src/app/services/api.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-trending',
  templateUrl: './trending.page.html',
  styleUrls: ['./trending.page.scss'],
})
export class TrendingPage implements OnInit {
  allTrendingVideos: any = [];
  isAPIcall: any = true;
  isSpinner: any = true;
  isShown: boolean = false;
  @ViewChild(IonContent, { static: false }) content: IonContent;
  constructor(
    public gs: GlobalService,
    public api: ApiService,
    public router: Router,
    public admobS: AdmobfreeService,
  ) {
    this.getTrendingVideos('');
  }

  ngOnInit() {
  }

  getTrendingVideos(event) {
    this.gs.presentLoading('Videos loading...');
    let body = {
      language_id: String(this.gs.selectedLang),
      start: this.allTrendingVideos.length,
    }
    this.api.post('getTrendingVideos', body).then((res) => {
      if (res['ResponseCode'] == 1) {
        this.allTrendingVideos = res['ResultData'];
      } else {
        this.gs.messageToast('Something went wrong');
      }
      event.target.complete();
      this.gs.dissmisLoding();
      this.isSpinner = false;
    }, err => {
      event.target.complete();
      this.gs.dissmisLoding();
      this.isSpinner = false;
      this.gs.messageToast('Something went wrong');
    })
  }

  loadData(infiniteScroll) {
    if (this.isAPIcall) {
      let body = {
        language_id: String(this.gs.selectedLang),
        start: this.allTrendingVideos.length
      }
      this.api.post('getTrendingVideos', body).then((res) => {
        if (res['ResponseCode'] == 1) {
          if (res['ResultData'].length) {
            for (let i = 0; i < res['ResultData'].length; i++) {
              this.allTrendingVideos.push(res['ResultData'][i]);
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

  goVideoSlides(data, index) {
    this.router.navigate(['/video-slides'], {
      queryParams: {
        item: JSON.stringify({
          videoData: data,
          index: index,
          endPoint: 'getTrendingVideos',
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

  doRefresh(event) {
    this.isSpinner = true;
    this.allTrendingVideos = [];
    this.getTrendingVideos(event);
  }

}
