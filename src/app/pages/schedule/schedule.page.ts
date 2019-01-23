import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';

import { GeneralService } from '../../providers/general.service';
import { FunctionService } from '../../providers/function.service';
import { PeriodPage } from './period/period.page';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
})
export class SchedulePage implements OnInit{
  segment = '';
  queryText = '';
  startDate: string;
  endDate: string;

  constructor(private loadingCtrl: LoadingController,
              private modalCtrl: ModalController,
              private genService: GeneralService,
              private funService: FunctionService) { }

  ngOnInit() {
    this.genService.isLoggedIn().then(res => {
      if (res) {
        this.genService.getPeriod().then(period => {
          if (period) {
            this.startDate = period.start;
            this.endDate = period.end;
            this.updateSchedule();
          } else {
            this.getDatePeriod();
          }
        })
      }
    })
  }

  updateSchedule() {
    console.log('update schedule')
  }

  processBySegment() {
    if (this.segment === 'one') {
      this.chooseTrack();
    } else if (this.segment === 'all') {
      this.updateFilter();
    } else if (this.segment === 'favorites') {
      this.updateFilter();
    }
  }

  chooseTrack() {
    console.log("choose a track")
  }

  updateFilter() {
    console.log('update filter')
  }

  resetFilter() {
    console.log('reset filter')
  }

  async getDatePeriod() {
    const start = this.startDate ? this.startDate : this.funService.getDateFormat();
    const end = this.endDate ? this.endDate : start ;
    const modal = await this.modalCtrl.create({
      component: PeriodPage,
      componentProps: { start, end }
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.startDate = data.start;
      this.endDate = data.end;
      this.genService.setPeriod({ start: this.startDate, end: this.endDate });
      this.updateSchedule();
    }
  }

  async openSocial(network: string, fab: HTMLIonFabElement) {
    const loading = await this.loadingCtrl.create({
      message: `Posting to ${network}`,
      duration: (Math.random() * 1000) + 500
    });
    await loading.present();
    await loading.onWillDismiss();
    fab.close();
  }
}
