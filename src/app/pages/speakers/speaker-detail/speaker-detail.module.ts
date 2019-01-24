import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { SpeakerDetailPage } from './speaker-detail.page';

const routes: Routes = [
  {
    path: '',
    component: SpeakerDetailPage
  }
];
@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SpeakerDetailPage]
})
export class SpeakerDetailModule { }
