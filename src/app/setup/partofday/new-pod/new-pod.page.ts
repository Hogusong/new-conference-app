import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { PARTOFDAY } from 'src/app/models';
import { AlertController } from '@ionic/angular';
import { FunctionService } from 'src/app/providers/function.service';
import { UserService } from 'src/app/providers/user.service';
import { GeneralService } from 'src/app/providers/general.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-pod',
  templateUrl: './new-pod.page.html',
  styleUrls: ['./new-pod.page.scss'],
})
export class NewPodPage implements OnInit {

  header = 'Part Of Day';
  PODs: PARTOFDAY[] = [];
  newPODs: PARTOFDAY[] = [];
  title = '';
  timeFrom: string;
  timeTo: string;
  len: number;

  constructor(private cdRef: ChangeDetectorRef,
              private alertCtrl: AlertController,
              private funService: FunctionService,
              private userService: UserService,
              private genService: GeneralService,
              private router: Router) { }

  ngOnInit() {
    this.genService.getUser().then(user => {
      if ( !user || user.username !== 'admin') {
        this.router.navigateByUrl('/tutorial');
      } else {
        this.genService.getPartsOfDay().subscribe(data => this.PODs = data);
        this.setInitialValue();
      }
   })
  }

  setInitialValue() {
    this.title = '';
    this.len = this.newPODs.length;
    if (this.len === 0) {
      this.timeFrom = '00:00';
    } else {
      this.timeFrom = this.funService.addMinute(this.newPODs[this.len - 1].timeTo);
    }
    this.timeTo = this.funService.addMinute(this.timeFrom);
  }

  cancelInput() {
    this.setInitialValue();
  }

  saveInput() {
    if (this.isTheValueUsed()) {
      this.funService.onError(this.header, 'Description is not valid. Try again');
    } else {
      const newPOD = {
        indexKey: this.newPODs.length + 1,
        name: this.title,
        timeFrom: this.timeFrom,
        timeTo: this.timeTo
      } as PARTOFDAY;
      this.newPODs.push(newPOD);
      if (this.timeTo === '23:59') {
        this.presentConfirm();
      } else {
        this.setInitialValue();
      }
    }
  }

  isTheValueUsed() {
    this.title = this.title.trim();
    if (this.title === '') {
      return true;
    }
    return this.PODs.find(pod => pod.name.toLowerCase() === this.title.toLowerCase());
  }

  checkTimeTo(value) {
    this.cdRef.detectChanges();
    if (value <= this.timeFrom) {
      this.funService.onError(this.header, 'Wrong time for To. Try again.');
      this.timeTo = this.funService.addMinute(this.timeFrom);
    }
  }

  async presentConfirm() {
    const alert = await this.alertCtrl.create({
      header: 'Confirm Save',
      message: 'Done the job. Do you want to save it?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.router.navigateByUrl('setup/tabs/partofday');
          }
        },
        {
          text: 'Save',
          handler: () => {
            this.genService.changePartsOfDay(this.PODs, this.newPODs);
            this.router.navigateByUrl('setup/tabs/partofday');
          }
        }
      ],
      backdropDismiss: false
    });
    await alert.present();
  }

  convertFormat(time) {
    return this.funService.timeFormat24to12(time);
  }
}
