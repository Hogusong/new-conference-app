import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { SPEAKER } from 'src/app/models';
import { SpeakerService } from 'src/app/providers/speaker.service';

@Component({
  selector: 'app-speaker-edit',
  templateUrl: './speaker-edit.page.html',
  styleUrls: ['./speaker-edit.page.scss'],
})
export class SpeakerEditPage implements OnInit {

  mode: string;
  id: string;
  speaker: SPEAKER;

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private speakerService: SpeakerService) { }

  ngOnInit() {
    this.mode = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.mode === 'New') {
      this.speaker = {
        name: '',        profilePic: '',        twitter: '',
        github: '',      instagram: '',         about: '',
        location: '',    email: '',             phone: '',
        sessions: [],
      };
    } else {
      [this.id, this.mode] = [this.mode, 'Edit'];
      this.speakerService.getSpeakerByID(this.id).then(res => {
        this.speaker = res;
        this.speaker.id = this.id;
      });
    }
  }

  onSubmit() {
    console.log('saved', this.speaker);
    this.router.navigate(['setup/tabs/set-speakers']);
  }

  onExit() {
    this.router.navigate(['setup/tabs/set-speakers']);
  }
}
