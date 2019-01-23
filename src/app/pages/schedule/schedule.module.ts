import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SchedulePage } from './schedule.page';
import { PeriodPage } from './period/period.page';
import { ScheduleTrackPage } from './schedule-track/schedule-track';

const routes: Routes = [
  {
    path: '',
    component: SchedulePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SchedulePage, PeriodPage, ScheduleTrackPage],
  entryComponents: [PeriodPage, ScheduleTrackPage]
})
export class SchedulePageModule {}
