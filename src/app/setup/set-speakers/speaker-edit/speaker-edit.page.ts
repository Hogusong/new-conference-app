import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { SPEAKER } from 'src/app/models';
import { SpeakerService } from 'src/app/providers/speaker.service';
import { FunctionService } from 'src/app/providers/function.service';

@Component({
  selector: 'app-speaker-edit',
  templateUrl: './speaker-edit.page.html',
  styleUrls: ['./speaker-edit.page.scss'],
})
export class SpeakerEditPage implements OnInit {

  mode: string;
  id: string = '';
  email: string = '';
  speaker: SPEAKER;
  speakers: SPEAKER[];
  header = `Speaker's Info`;

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private speakerService: SpeakerService,
              private funService: FunctionService) { }

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
        this.email = this.speaker.email;
      });
    }
    this.speakerService.getSpeakers().subscribe(res => {
      this.speakers = res;
    })
  }

  onSubmit() {
    if (this.verifiedInput()) {
      if (this.mode === 'New') {
        this.speakerService.addNewSpeaker(this.speaker);
      } else {
        this.speakerService.updateSpeaker(this.speaker);
      }
      this.router.navigate(['setup/tabs/set-speakers']);
    }
  }

  verifiedInput() {
    this.speaker.name = this.speaker.name.trim() ;
    this.speaker.profilePic = this.speaker.profilePic.trim() ;
    this.speaker.email = this.speaker.email.trim() ;
    this.speaker.phone = this.speaker.phone.trim() ;
    this.speaker.github = this.speaker.github.trim();
    this.speaker.instagram = this.speaker.instagram.trim() ;
    this.speaker.location = this.speaker.location.trim() ;
    this.speaker.twitter = this.speaker.twitter.trim() ;
    this.speaker.about = this.speaker.about.trim() ;
    if (this.speaker.name.length < 3) {
      this.funService.onError(this.header, 'Name should be more than 2 digits.');
    } else if (!this.speaker.email.includes('@')) {
      this.funService.onError(this.header, 'Email is not valid. Try another.');
    } else if (this.isEmailUsed(this.speaker.email)) {
      this.funService.onError(this.header, 'This email was used. Try another.');
    } else if (this.speaker.phone.length < 10) {
      this.funService.onError(this.header, 'Phone number is not valid. Try again.');
    } else {
      return true;
    }
    return false;
  }

  isEmailUsed(email: string) {
    if (this.email === email) {
      return false;
    }
    return this.speakers.find(spk => spk.email.toLowerCase() === email.toLowerCase());
  }


  onExit() {
    this.router.navigate(['setup/tabs/set-speakers']);
  }
}
