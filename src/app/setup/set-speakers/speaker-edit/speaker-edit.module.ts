import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SpeakerEditPage } from './speaker-edit.page';
import { DropZoneDirective } from 'src/app/directive/drop-zone.directive';
import { FileSizePipe } from 'src/app/pipe/file-size.pipe';
import { UploadImagePage } from 'src/app/pages/upload-image/upload-image.page';

const routes: Routes = [
  {
    path: '',
    component: SpeakerEditPage
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
    SpeakerEditPage,
    DropZoneDirective,
    FileSizePipe,
    UploadImagePage
  ]
})
export class SpeakerEditPageModule {}
