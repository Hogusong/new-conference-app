import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { SPEAKER } from 'src/app/models';
import { SpeakerService } from 'src/app/providers/speaker.service';

@Component({
  selector: 'speaker-detail',
  templateUrl: 'speaker-detail.html',
  styleUrls: ['./speaker-detail.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SpeakerDetailPage {
  speaker: SPEAKER;

  constructor(private speakerService: SpeakerService,
              private router: Router,
              private route: ActivatedRoute,
              public inAppBrowser: InAppBrowser) {}

  ionViewWillEnter() {
    const id = this.route.snapshot.paramMap.get('id');
    this.speakerService.getSpeakerByID(id).then( data => 
      { this.speaker = data; }
    );
  }

  goToSessionDetail(id: any) {
    this.router.navigateByUrl(`tabs/(schedule/session/${id})`);
  }

  goToSpeakerTwitter() {
    this.inAppBrowser.create(
      `https://twitter.com/${this.speaker.twitter}`,
      '_blank'
    );
  }

  goToSpeakergithub() {
    this.inAppBrowser.create(
      `https://github.com/${this.speaker.github}`,
      '_blank'
    );
  }

  goToSpeakerInstagram() {
    this.inAppBrowser.create(
      `https://instagram.com/${this.speaker.instagram}`,
      '_blank'
    );
  }
}
