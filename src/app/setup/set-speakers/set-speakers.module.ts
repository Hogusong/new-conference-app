import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SetSpeakersPage } from './set-speakers.page';

const routes: Routes = [
  {
    path: '',
    component: SetSpeakersPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SetSpeakersPage]
})
export class SetSpeakersPageModule {}
