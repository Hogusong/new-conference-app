import { Injectable } from '@angular/core';
import { AngularFirestoreCollection,
         AngularFirestoreDocument,
         AngularFirestore }   from 'angularfire2/firestore';
import { Events } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { USER, TRACK, PARTOFDAY } from '../models';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  IS_LOGGED_IN = 'is_logged_in'

  tracksCollection: AngularFirestoreCollection<TRACK>;
  trackDoc: AngularFirestoreDocument<TRACK>;

  partsOfDayCollection: AngularFirestoreCollection<PARTOFDAY>;
  partOfDayDoc: AngularFirestoreDocument<PARTOFDAY>;

  constructor(private db: AngularFirestore,
              private storage: Storage,
              public events: Events,
              private userService: UserService) {
    this.tracksCollection = this.db.collection(
      'tracks', ref => ref.orderBy('name', 'asc'));
    this.partsOfDayCollection = this.db.collection(
      'partOfDay', ref => ref.orderBy('indexKey', 'asc'));
  }

  getPartsOfDay(): Observable<PARTOFDAY[]> {
    return this.partsOfDayCollection.snapshotChanges()
      .pipe(map(response => {
        return response.map(action => {
          const data = action.payload.doc.data() as PARTOFDAY;
          data.id = action.payload.doc.id;
          return data;
        });
      }));
  }

  updatePartOfDay(pod: PARTOFDAY) {
    const id = pod.id;
    delete(pod.id);
    this.partOfDayDoc = this.db.doc(`partsOfDay/${id}`);
    this.partOfDayDoc.update(pod);
  }

  changePartsOfDay(PODs: PARTOFDAY[], newPODs: PARTOFDAY[]) {
    PODs.forEach(pod => {
      const podDoc = this.db.doc(`partsOfDay/${pod.id}`);
      podDoc.delete();
    });

    newPODs.forEach(pod => {
      this.partsOfDayCollection.add(pod);
    });
  }

  getTracks(): Observable<TRACK[]> {
    return this.tracksCollection.snapshotChanges()
      .pipe(map(response => {
        return response.map(action => {
          const data = action.payload.doc.data() as TRACK;
          data.id = action.payload.doc.id;
          return data;
        });
      }));
  }

  addTrack(track: TRACK) {
    this.tracksCollection.add(track);
  }

  updateTrack(track: TRACK) {
    const id = track.id;
    delete(track.id);
    this.trackDoc = this.db.doc(`tracks/${id}`);
    this.trackDoc.update(track);
    track.id = id;
  }

  removeTrack(track: TRACK) {
    this.trackDoc = this.db.doc(`tracks/${track.id}`);
    this.trackDoc.delete();
  }

  getPeriod(): Promise<any> {
    return this.storage.get('period');
  }

  // set period = { start: string, end: string }
  setPeriod(date: any): Promise<any> {
    return this.storage.set('period', date);
  }

  isLoggedIn(): Promise<any> {
    return this.storage.get(this.IS_LOGGED_IN);
  }

  login(user: USER): Promise<any> {
    return this.storage.set(this.IS_LOGGED_IN, true)
      .then(() => this.storage.set('user', user))
      .then(() => this.events.publish('user:login'));
  }

  logout(): Promise<any> {
    return this.storage.set(this.IS_LOGGED_IN, false)
      .then(() => this.storage.remove('user'))
      .then(() => this.events.publish('user:logout'));
  }

  signup(user: USER): Promise<any> {
    return this.userService.addUser(user);
  }

  getUser(): Promise<USER> {
    return this.storage.get('user');
  }

  setUser(user: USER): Promise<USER> {
    return this.storage.set('user', user);
  }
}
