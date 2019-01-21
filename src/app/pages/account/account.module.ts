import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AccountPage } from './account.page';
import { FileSizePipe } from '../../pipe/file-size.pipe';
import { DropZoneDirective } from '../../directive/drop-zone.directive';
import { UploadImagePage } from '../upload-image/upload-image.page';

const routes: Routes = [
  {
    path: '',
    component: AccountPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    AccountPage,
    FileSizePipe,
    DropZoneDirective,
    UploadImagePage
  ]
})
export class AccountPageModule {}
