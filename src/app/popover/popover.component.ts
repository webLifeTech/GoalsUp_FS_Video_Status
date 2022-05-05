import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {

  constructor(
    public router : Router,
    public pc : PopoverController
  ) { }

  ngOnInit() {}

  changePassword(){
    this.router.navigate(['/change-pass']);
    this.pc.dismiss();
  }

  forgetPassword(){
    this.router.navigate(['/forget-pass']);
    this.pc.dismiss();
  }

  logout(){
    localStorage.removeItem('MLMlogUser')
    this.router.navigate(['/login-register']);
    this.pc.dismiss();
  }


}
