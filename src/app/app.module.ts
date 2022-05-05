import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { InputValidationDirective } from './Directives/input-validation.directive';
import { Market } from '@ionic-native/market/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { AdMobFree } from '@ionic-native/admob-free/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { VideoEditor } from '@ionic-native/video-editor/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';


@NgModule({
  declarations: [AppComponent, InputValidationDirective],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    DatePipe,
    File,
    FilePath,
    FileTransfer,
    FileOpener,
    Market,
    SocialSharing,
    AndroidPermissions,
    InAppBrowser,
    AppVersion,
    VideoEditor,
    StatusBar,
    AdMobFree,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule { }
