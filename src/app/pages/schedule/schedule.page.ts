import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';

import { GeneralService } from 'src/app/providers/general.service';

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
              private genService: GeneralService) { }

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

  getDatePeriod() {
    console.log('get period of date')
    this.startDate = '2019-01-01';
    this.endDate = '2019-12-31';
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
