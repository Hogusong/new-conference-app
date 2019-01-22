import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

import { SESSION, TRACK, SPEAKER } from 'src/app/models';
import { SessionService } from 'src/app/providers/session.service';
import { SpeakerService } from 'src/app/providers/speaker.service';
import { GeneralService } from 'src/app/providers/general.service';
import { FunctionService } from 'src/app/providers/function.service';

@Component({
  selector: 'app-session-edit',
  templateUrl: './session-edit.page.html',
  styleUrls: ['./session-edit.page.scss'],
})
export class SessionEditPage implements OnInit {

  mode: string;
  id: string;
  session: SESSION;
  minYear: string;
  maxYear: string;
  tracks: TRACK[];
  speakers: SPEAKER[];
  s_tracks: { name: string, isChecked: boolean }[] = [];
  moreSpeakers = false;

  constructor(private activatedRoute: ActivatedRoute,
              private cdRef: ChangeDetectorRef,
              private modalCtrl: ModalController,
              private sessionService: SessionService,
              private speakerService: SpeakerService,
              private genService: GeneralService,
              private funService: FunctionService,
              private router: Router) { }

  ngOnInit() {
    this.mode = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.mode === 'New') {
      const today = new Date();
      this.minYear = '' + (today.getFullYear() - 20);
      this.maxYear = '' + (+this.minYear + 40);
      this.session = {
        name: '',
        date: this.funService.getDateFormat(),         // 2018-12-06
        timeStart: '10:00',    // 15:30 for 3:30pm
        timeEnd: '10:00',
        location: '',
        description: '',
        speakerIDs: [],   // speaker's id
        tracks: [],   //  name of track
      };
    } else {
      [this.id, this.mode] = [this.mode, 'Edit'];
      this.sessionService.getSessionById(this.id).then(data => {
        this.session = data;
        this.session.id = this.id;
        this.minYear = '' + (+data.date.slice(0, 4) - 5);
        this.maxYear = '' + (+this.minYear + 15);
      });
    }
    this.getSpeakersTracks();
  }

  getSpeakersTracks() {
    this.speakerService.getSpeakers().subscribe(data => {
      this.speakers = data;
    });

    this.genService.getTracks().subscribe(data => {
      this.tracks = data;
    });
  }

  isInSession(key: string, type: string): any {
    if (type === 'Speaker') {
      return this.session.speakerIDs.find(id => id === key);
    }
    return this.session.tracks.find(name => name === key);
  }

  onRemoveSpeaker(s_id) {
    const idx = this.session.speakerIDs.findIndex(id => id === s_id);
    if (idx > -1) {
      this.session.speakerIDs.splice(idx, 1);
    }
  }

  async selectSpeakers() {
    console.log('select speakers');
  }

  onRemoveTrack(s_name) {
    const idx = this.session.tracks.findIndex(name => name === s_name);
    if (idx > -1) {
      this.session.tracks.splice(idx, 1);
    }
  }

  async selectTracks() {
    console.log('select tracks');
  }

  changeTimeEnd(value) {
    this.cdRef.detectChanges();
    if (value > this.session.timeEnd) {
      this.session.timeEnd = this.funService.addMinute(value);
    }
  }

  confirmTimeEnd(value) {
    this.cdRef.detectChanges();
    if (value <= this.session.timeStart) {
      this.funService.onError('Confirm Time', 'Wrong time for To. Try again.');
      this.session.timeEnd = this.funService.addMinute(this.session.timeStart);
    }
  }

  onSubmit() {
    this.session.name = this.session.name.trim();
    this.session.location = this.session.location.trim();
    if (this.isValidAll()) {
      if (this.mode === 'New') {
        this.sessionService.addNewSession(this.session);
      } else {
        this.sessionService.updateSession(this.session);
      }
      this.onExit();
    }
  }

  onExit() {
    this.router.navigateByUrl('/setup/tabs/(sessions:sessions)');
  }

  isValidAll() {
    if (this.session.name.length === 0) {
      this.funService.onError('Confirm Title', 'Need a Title for the session. Try again.');
      return false;
    } else if (this.session.timeEnd <= this.session.timeStart) {
      this.funService.onError('Confirm Time', 'TimeTo has to be later than TimeFrom. Try again.');
      return false;
    }
    return true;
  }
}
