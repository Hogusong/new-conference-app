import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SessionsPage } from './sessions.page';
import { PeriodPage } from './period/period.page';

const routes: Routes = [
  {
    path: '',
    component: SessionsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SessionsPage, PeriodPage],
  entryComponents: [PeriodPage]
})
export class SessionsPageModule {}
