import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { AdmobfreeService } from 'src/app/services/admobfree.service';
import { ApiService } from 'src/app/services/api.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit {
  allCategoryList: any = [];
  isAPIcall: boolean = true;
  isSpinner: any = true;
  isShown: boolean = false;
  public myfilter: any = '';
  @ViewChild(IonContent, { static: false }) content: IonContent;
  constructor(
    public gs: GlobalService,
    public api: ApiService,
    public router: Router,
    public admobS: AdmobfreeService,
  ) {
    this.getCetegory();
  }

  ngOnInit() {
  }

  getCetegory() {
    this.gs.presentLoading('Category loading...');
    let body = {
      language_id: String(this.gs.selectedLang),
      start: 0,
    }
    this.api.post('getCategoryList', body).then((res) => {
      console.log("res>>>", res);

      if (res['ResponseCode'] == 1) {
        this.allCategoryList = res['ResultData'];
        for (let i in this.allCategoryList) {
          this.allCategoryList[i].category_name = this.allCategoryList[i].category_name.split(" ").join("");
        }
        console.log('this.allCategoryList', this.allCategoryList);
      } else {
        this.gs.messageToast('Something went wrong');
      }
      this.isSpinner = false;
      this.gs.dissmisLoding();
    }, err => {
      this.isSpinner = false;
      this.gs.dissmisLoding();
      this.gs.messageToast('Something went wrong');
    })
  }

  getVideoListByCategory(item) {
    this.gs.presentLoading('Loading...');
    let body = {
      category_id: item.category_id,
      language_id: String(this.gs.selectedLang),
      start: this.gs.randomInteger(0, item.total_record || 4),
    }
    this.api.post('getVideoListByCategory', body).then((res) => {
      this.gs.dissmisLoding();
      if (res['ResponseCode'] == 1) {
        this.gs.catTotalRecord = res['total_record']
        this.goVideoSlides(res['ResultData'], item.category_id, 0)
      } else {
        this.gs.messageToast('Something went wrong');
      }
      this.isSpinner = false;
    }, err => {
      this.isSpinner = false;
      this.gs.dissmisLoding();
      this.gs.messageToast('Something went wrong');
    })
  }

  goVideoSlides(data, category_id, index) {
    this.router.navigate(['/video-slides'], {
      queryParams: {
        item: JSON.stringify({
          videoData: data,
          index: index,
          category: category_id,
          endPoint: 'getVideoListByCategory',
        })
      }
    });
  }

  loadData(infiniteScroll) {
    if (this.isAPIcall) {
      let body = {
        language_id: String(this.gs.selectedLang),
        start: this.allCategoryList.length,
      }
      this.api.post('getCategoryList', body).then((res) => {
        if (res['ResponseCode'] == 1) {
          if (res['ResultData'] && res['ResultData'].length) {
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
