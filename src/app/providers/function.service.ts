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
 
  timeFormat24to12(time: string): string {
    if (time.length !== 5 || !time.includes(':')) {
      return '00:00 AM'
    }
    const arr = time.split(':');
    const type = (+arr[0] > 11) ? ' PM' : ' AM' ;
    const hour = (+arr[0] <= 12) ? arr[0] : this.get2DigitString(+arr[0]-12);
    return hour + ':' + arr[1] + type;
  }

  get2DigitString(num: number): string {
    return (num < 10) ? '0' + num : '' + num ;   
  }

  addMinute(time: string): string {
    const [h, m] = time.split(':');
    const hour = this.get2DigitString((m === '59') ? +h + 1 : +h);
    const min = this.get2DigitString((m === '59') ? 0 : +m + 1);
    return (hour === '24') ? null : hour + ':' + min ;
  }

  checkDateValidation(s_date: string): boolean {
    const months = [1, 3, 5, 7, 8, 10, 12];
    const arr = s_date.split('-');
    const year = +arr[0];
    const month = +arr[1];
    const date = +arr[2];
    if (months.find(num => num === month)) { return date < 32; }
    if (month > 2) { return date < 31; }
    if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
      return date < 30;
    }
    return date < 29;
  }

  getDateFormat(date?: Date) {
    if (!date) {
      date = new Date();
    }
    const dateArray = date.toLocaleDateString().split('/');
    return dateArray[2] + '-' +
           this.get2DigitString(+dateArray[0]) + '-' +
           this.get2DigitString(+dateArray[1]);
  }
}
