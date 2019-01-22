import { Component, OnInit } from '@angular/core';

import { GeneralService } from 'src/app/providers/general.service';
import { UserService } from 'src/app/providers/user.service';
import { TRACK, USER, SESSION } from 'src/app/models';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { FunctionService } from 'src/app/providers/function.service';
import { SessionService } from 'src/app/providers/session.service';

@Component({
  selector: 'app-tracks',
  templateUrl: './tracks.page.html',
  styleUrls: ['./tracks.page.scss'],
})
export class TracksPage implements OnInit {

  tracks: TRACK[] = [];
  users: USER[] = [];
  sessions: SESSION[] = [];

  constructor(private genService: GeneralService,
              private userService: UserService,
              private sessionService: SessionService,
              private funService: FunctionService,
              private alertCtrl: AlertController,
              private router: Router) { }

  ngOnInit() {
    this.genService.getUser().then(user => {
      if (!user || user.username !== 'admin') {
        this.router.navigate(['/tutorial']);
      } else {
        this.genService.getTracks().subscribe(res => {
          this.tracks = res;
        });
        this.userService.getUsers().subscribe(res => {
          this.users = res;
        });
        this.sessionService.getSessions().subscribe(res => {
          this.sessions = res;
        })
      }
    });
  }

  async addNewTrack() {
    const addForm = await this.alertCtrl.create({
      header: 'Add a Track',
      buttons: [
        'Cancel',
        {
          text: 'Ok',
          handler: (data: any) => {
            data.newName = data.newName.trim();
            if (data.newName.length < 3) {
              this.funService.onError(`Track's Info.`, data.newName + ' should be more than 2 letters. Try another.');
            } else if (this.isTheValueUsed(data.newName)) {
              this.funService.onError(`Track's Info.`, data.newName + ' was used already. Try another.');
            } else {
              this.genService.addTrack({ name: data.newName });
              this.users.forEach(user => {
                user.trackFilter.push({ name: data.newName, isChecked: true });
                this.userService.updateUser(user);
              })
            }
          }
        }
      ],
      inputs: [
        {
          type: 'text',
          name: 'newName',
          placeholder: 'new name here'
        }
      ],
      backdropDismiss: false
    });
    await addForm.present();
  }

  async changeName(track: TRACK) {
    const changeForm = await this.alertCtrl.create({
      header: 'Change Track',
      subHeader: track.name,
      buttons: [
        'Cancel',
        {
          text: 'Ok',
          handler: (data: any) => {
            data.newName = data.newName.trim();
            if (data.newName.length < 3) {
              this.funService.onError(`Track's Info.`, data.newName + ' should be more than 2 letters. Try another.');
            } else if (this.isTheValueUsed(data.newName)) {
              this.funService.onError(`Track's Info.`, data.newName + ' was used already. Try another.');
            } else {
              const oldName = track.name;
              track.name = data.newName
              this.genService.updateTrack(track);
              // update track's name in User's trackFilter
              this.updateTrackInUser(data.newName, oldName);
              // update track's name in Session's track name
              this.updateTrackInSessions(data.newName, oldName);
            }
          }
        }
      ],
      inputs: [
        {
          type: 'text',
          name: 'newName',
          value: track.name,
          placeholder: 'new name here'
        }
      ],
      backdropDismiss: false
    });
    await changeForm.present();
  }

  async onConfirmToRemove(track: TRACK) {
    const alert = await this.alertCtrl.create({
      header: 'Confirm Remove',
      message: `Are you sure to remove ${track.name}?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Remove',
          handler: () => {
            this.genService.removeTrack(track);
            this.removeTrackInUser(track.name);
            this.removeTrackInSession(track.name);
          }
        }
      ],
      backdropDismiss: false
    });
    await alert.present();
  }

  isTheValueUsed(name: string) {
    return this.tracks.find(t => t.name.toLowerCase() === name.toLowerCase());
  }

  updateTrackInUser(newName, oldName) {
    this.users.forEach(user => {
      const idx = user.trackFilter.findIndex(t => t.name === oldName);
      if (idx > -1) {
        user.trackFilter[idx].name = newName;
        this.userService.updateUser(user);
      }
    });
  }

  updateTrackInSessions(newName: string, oldName: string) {
    this.sessions.forEach(session => {
      const idx = session.tracks.findIndex(name => name === oldName);
      if (idx > -1) {
        session.tracks[idx] = newName;
        this.sessionService.updateSession(session);
      }
    });
  }

  removeTrackInUser(name: string) {
    this.users.forEach(user => {
      const idx = user.trackFilter.findIndex(tf => tf.name === name);
      if (idx > -1) {
        user.trackFilter.splice(idx, 1);
        this.userService.updateUser(user);
      }
    });
  }

  removeTrackInSession(oldName: string) {
    this.sessions.forEach(session => {
      const idx = session.tracks.findIndex(name => name === oldName);
      if (idx > -1) {
        session.tracks.splice(idx, 1);
        this.sessionService.updateSession(session);
      }
    });
  }
}
