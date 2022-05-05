import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { AdmobfreeService } from 'src/app/services/admobfree.service';
import { ApiService } from 'src/app/services/api.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  isAPIcall: boolean = true;
  isShown: boolean = false;
  binding = '1'
  @ViewChild(IonContent, { static: false }) content: IonContent;

  constructor(
    public gs: GlobalService,
    public api: ApiService,
    public admobS: AdmobfreeService,
    public router: Router
  ) { }

  ngOnInit() {
  }

  goVideoSlides(data, index) {
    this.router.navigate(['/video-slides'], {
      queryParams: {
        item: JSON.stringify({
          videoData: data,
          index: index,
          endPoint: 'getHomePageVideoList'
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

  loadData(infiniteScroll) {
    if (this.isAPIcall) {
      let body = {
        language_id: String(this.gs.selectedLang),
        start: this.gs.randomInteger(0, this.gs.homeTotalRecord),
      }
      this.api.post('getHomePageVideoList', body).then((res) => {
        if (res['ResponseCode'] == 1) {
          if (res['ResultData'].length) {
            for (let i = 0; i < res['ResultData'].length; i++) {
              this.gs.homeVideos.push(res['ResultData'][i]);
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

  segmentChanged(event) {
    if (event.target.value != 'none') {
      this.goWpStatus(event.target.value);
    } else {
      this.router.navigate(['/status-saver'])
    }
  }

  goWpStatus(index) {
    this.router.navigate(['/status-saver-slide'], {
      queryParams: {
        item: JSON.stringify({
          index: index,
        })
      }
    });
  }

  goQuotesSlides(index) {
    this.router.navigate(['/status-saver-slide'], {
      queryParams: {
        item: JSON.stringify({
          index: index,
        })
      }
    });
  }

  doRefresh(event) {
    this.gs.getHomeVideos({
      language_id: String(this.gs.selectedLang),
      start: this.gs.randomInteger(0, this.gs.homeTotalRecord),
      event: event,
    })
  }

}
