import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'discover',
    loadChildren: () => import('./pages/discover/discover.module').then(m => m.DiscoverPageModule)
  },
  {
    path: 'upload',
    loadChildren: () => import('./pages/upload/upload.module').then(m => m.UploadPageModule)
  },
  {
    path: 'trending',
    loadChildren: () => import('./pages/trending/trending.module').then(m => m.TrendingPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfilePageModule)
  },
  {
    path: 'download',
    loadChildren: () => import('./pages/download/download.module').then(m => m.DownloadPageModule)
  },
  {
    path: 'faverite',
    loadChildren: () => import('./pages/faverite/faverite.module').then(m => m.FaveritePageModule)
  },
  {
    path: 'video-slides',
    loadChildren: () => import('./pages/video-slides/video-slides.module').then(m => m.VideoSlidesPageModule)
  },
  {
    path: 'quotes',
    loadChildren: () => import('./pages/quotes/quotes.module').then(m => m.QuotesPageModule)
  },
  {
    path: 'privacy-police',
    loadChildren: () => import('./pages/privacy-police/privacy-police.module').then(m => m.PrivacyPolicePageModule)
  },
  {
    path: 'quotes-slider',
    loadChildren: () => import('./pages/quotes-slider/quotes-slider.module').then(m => m.QuotesSliderPageModule)
  },
  {
    path: 'quotes-faverite',
    loadChildren: () => import('./pages/quotes-faverite/quotes-faverite.module').then(m => m.QuotesFaveritePageModule)
  },
  {
    path: 'other-profile',
    loadChildren: () => import('./pages/other-profile/other-profile.module').then(m => m.OtherProfilePageModule)
  },
  {
    path: 'view-video',
    loadChildren: () => import('./pages/view-video/view-video.module').then(m => m.ViewVideoPageModule)
  },
  {
    path: 'view-quotes',
    loadChildren: () => import('./pages/view-quotes/view-quotes.module').then(m => m.ViewQuotesPageModule)
  },
  {
    path: 'other-video-slides',
    loadChildren: () => import('./pages/other-video-slides/other-video-slides.module').then(m => m.OtherVideoSlidesPageModule)
  },
  {
    path: 'status-saver',
    loadChildren: () => import('./pages/status-saver/status-saver.module').then(m => m.StatusSaverPageModule)
  },
  {
    path: 'status-saver-slide',
    loadChildren: () => import('./pages/status-saver-slide/status-saver-slide.module').then(m => m.StatusSaverSlidePageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'welcome',
    loadChildren: () => import('./pages/welcome/welcome.module').then(m => m.WelcomePageModule)
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'welcome'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
