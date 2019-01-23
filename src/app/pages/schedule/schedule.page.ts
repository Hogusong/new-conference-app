import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';

import { GeneralService } from '../../providers/general.service';
import { FunctionService } from '../../providers/function.service';
import { PeriodPage } from './period/period.page';
import { SessionService } from 'src/app/providers/session.service';
import { PARTOFDAY, SESSION, USER } from 'src/app/models';

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

  excludeTracks: any[] = [];
  partsOfDay: PARTOFDAY[];
  sessions: SESSION[];
  schedule: {
    date: string,
    groups: {
      indexKey: number
      partOfDay: string,
      sessions: any[]
    }[]
  }[] = [];
  user: USER;
 
  constructor(private loadingCtrl: LoadingController,
              private modalCtrl: ModalController,
              private genService: GeneralService,
              private sessionService: SessionService,
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
    this.schedule = [];
    this.genService.getUser().then(user => {
      user.trackFilter.forEach(track => {
        if (!track.isChecked) { this.excludeTracks.push(track.name); }
      });
      this.user = user;
      this.genService.getPartsOfDay().subscribe(
        response => { this.partsOfDay = response ; }
      );

      this.sessionService.getSessionsInPeriod(this.startDate, this.endDate).subscribe(
        (response: SESSION[]) => {
          this.sessions = response;
          this.buildSchedule();
      });
    });
  }

  getFilterOption() {
    return {
      queryText: this.queryText.toLowerCase().trim(),
      segment: this.segment,
      excludeTracks: this.excludeTracks
    };
  }

  buildSchedule() {
    const filterOption = this.getFilterOption();
    this.sessions.forEach(session => {
      session = this.sessionService.filterSession(session, filterOption);
      const partOfDay = this.partsOfDay.find(part => part.timeFrom <= session.timeStart && part.timeTo >= session.timeStart);
      const newGroup = {
        indexKey: partOfDay.indexKey,
        partOfDay: partOfDay.name,
        sessions: [session]
      };
      const newItem = { date: session.date, groups: [newGroup]};

      const sIndex = this.schedule.findIndex(item => item.date === session.date);
      if (sIndex < 0) {
        this.schedule.push(newItem);
      } else {
        const gIndex = this.schedule[sIndex].groups.findIndex(
          group => group.partOfDay === partOfDay.name
        );
        if (gIndex < 0) {
          this.schedule[sIndex].groups.push(newGroup);
        } else {
          this.schedule[sIndex].groups[gIndex].sessions.push(session);
        }
      }
    });
    this.schedule.sort((a, b) => {
      if (a.date > b.date) { return 1; }
      return -1;
    });
    this.schedule.forEach(item => {
      item.groups.sort((a, b) => a.indexKey - b.indexKey);
      item.groups.forEach(group => {
        group.sessions.sort((a, b) => {
          if (a.timeStart > b.timeStart) { return 1; }
          return -1;
        });
      });
    });
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
    const filterOption = this.getFilterOption();
    this.schedule.forEach(daily => {
      daily.groups.forEach(group => {
        group.sessions.forEach(session => {
          session = this.sessionService.filterSession(session, filterOption);
        });
      });
    });
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
