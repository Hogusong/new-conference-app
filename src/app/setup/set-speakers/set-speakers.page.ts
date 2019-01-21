import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SPEAKER } from 'src/app/models';
import { SpeakerService } from 'src/app/providers/speaker.service';
import { GeneralService } from 'src/app/providers/general.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-set-speakers',
  templateUrl: './set-speakers.page.html',
  styleUrls: ['./set-speakers.page.scss'],
})
export class SetSpeakersPage implements OnInit {

  queryText = '';
  speakers: SPEAKER[] = [];

  constructor(private speakerService: SpeakerService,
              private genService: GeneralService,
              private alertCtrl: AlertController,
              private router: Router) { }

  ngOnInit() {
    this.genService.getUser().then(user => {
      if (!user || user.username !== 'admin') {
        this.router.navigate(['/tutorial']);
      } else {
        this.speakerService.getSpeakers().subscribe(res => {
          this.speakers = res
        });
      }
    })
  }

  async onConfirmToRemove(speaker: SPEAKER) {
    const alert = await this.alertCtrl.create({
      header: 'Confirm Remove',
      message: `Are you sure to remove ${speaker.name}?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.router.navigate(['setup/tabs/set-speakers']);
          }
        },
        {
          text: 'Remove',
          handler: () => {
            this.speakerService.removeSpeaker(speaker);
            this.router.navigate(['setup/tabs/set-speakers']);
          }
        }
      ],
      backdropDismiss: false
    });
    await alert.present();
  }

  navigate(mode: string) {
    this.router.navigate(['/setup/tabs/set-speakers/edit', mode]);
  }
}
