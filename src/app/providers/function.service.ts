import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class FunctionService {

  constructor(private alertCtrl: AlertController) {}

  async onError(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      buttons: [
        {
          text: 'ok',
          role: 'cancel',
          handler: () => {
          }
        }
      ],
      backdropDismiss: false
    });
    await alert.present();
  }
}
