import { Component } from '@angular/core';

import { SPEAKER } from 'src/app/models';
import { SpeakerService } from 'src/app/providers/speaker.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ActionSheetController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-speakers',
  templateUrl: './speakers.page.html',
  styleUrls: ['./speakers.page.scss'],
})
export class SpeakersPage {
  
  speakers: SPEAKER[] = [];
  queryText = '';

  constructor(private speakerService: SpeakerService,
              private inAppBrowser: InAppBrowser,
              private actionSheetCtrl: ActionSheetController,
              private router: Router) { }

  ionViewDidEnter() {
    this.speakerService.getSpeakers().subscribe(res => {
      this.speakers = res;
    })
  }

  navigate(id) {
    this.router.navigate(['tabs/speakers/detail', id]);
  }

  goToSpeakerTwitter(speaker: SPEAKER) {
    this.inAppBrowser.create(
      `https://twitter.com/${speaker.twitter}`, '_blank'
    )
  }

  async openSpeakerShare(speaker: any) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Share ' + speaker.name,
      buttons: [
        {
          text: 'Copy Link',
          handler: () => {
            if (
              (window as any)['cordova'] &&
              (window as any)['cordova'].plugins.clipboard
            ) {
              (window as any)['cordova'].plugins.clipboard.copy(
                'https://twitter.com/' + speaker.twitter
              );
            }
          }
        },
        {
          text: 'Share via ...'
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  async openContact(speaker: SPEAKER) {
    const mode = 'ios'; // this.config.get('mode');

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Contact ' + speaker.name,
      buttons: [
        {
          text: `Email ( ${speaker.email} )`,
          icon: mode !== 'ios' ? 'mail' : null,
          handler: () => {
            window.open('mailto:' + speaker.email);
          }
        },
        {
          text: `Call ( ${speaker.phone} )`,
          icon: mode !== 'ios' ? 'call' : null,
          handler: () => {
            window.open('tel:' + speaker.phone);
          }
        }
      ]
    });
    await actionSheet.present();
  }
}
