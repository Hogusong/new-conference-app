import { Component, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AlertController, ToastController } from '@ionic/angular';

import { SupportService } from 'src/app/providers/support-service';
import { GeneralService } from 'src/app/providers/general.service';

@Component({
  selector: 'app-support',
  templateUrl: './support.page.html',
  styleUrls: ['./support.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SupportPage {
  isLoggedIn = false;
  submitted = false;
  supportMessage: string;

  constructor(public alertCtrl: AlertController,
              public toastCtrl: ToastController,
              private genService: GeneralService,
              private supportService: SupportService) {
  }

  async ionViewDidEnter() {
    this.genService.isLoggedIn()
      .then(res => this.isLoggedIn = res);
  }

  async submit(form: NgForm) {
    this.submitted = true;

    if (form.valid) {
      this.supportService.addSupport(this.supportMessage);
      this.supportMessage = '';
      this.submitted = false;
      const toast = await this.toastCtrl.create({
        message: 'Your support request has been sent.',
        duration: 3000
      });
      await toast.present();
    }
  }
}
