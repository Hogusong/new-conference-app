import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SessionEditPage } from './session-edit.page';
import { PickSpeakersPage } from '../pick-speakers/pick-speakers.page';

const routes: Routes = [
  {
    path: '',
    component: SessionEditPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SessionEditPage, PickSpeakersPage],
  entryComponents: [PickSpeakersPage]
})
export class SessionEditPageModule {}
