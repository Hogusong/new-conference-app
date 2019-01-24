import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SPEAKER, SESSION } from '../models';

@Injectable({
  providedIn: 'root'
})
export class SpeakerService {

  speakersCollection: AngularFirestoreCollection<SPEAKER>;
  speakerDoc: AngularFirestoreDocument<SPEAKER>;

  constructor(private db: AngularFirestore,
              private fireStorage: AngularFireStorage) {
    this.speakersCollection = this.db.collection(
      'speakers', ref => ref.orderBy('name', 'asc'));
  }

  getSpeakers(): Observable<SPEAKER[]> {
    return this.speakersCollection.snapshotChanges()
      .pipe(map(response => {
        return response.map(action => {
          const speaker = action.payload.doc.data() as SPEAKER;
          speaker.id = action.payload.doc.id;
          if (speaker.profilePic) {
            this.fireStorage.ref(speaker.profilePic).getDownloadURL().subscribe(url => {
              speaker.profilePic = url ? url : '';
            });
          }
          return speaker;
        });
      }));
  }

  getSpeakerByID(id: string) {
    return this.speakersCollection.doc(id).ref.get()
      .then(doc => {
        const speaker = doc.data() as SPEAKER;
        if (speaker.profilePic) {
          this.fireStorage.ref(speaker.profilePic).getDownloadURL().subscribe(url => {
            speaker.profilePic = url;
          });
        }
        return speaker;
      });
  }

  addNewSpeaker(speaker: SPEAKER) {
    this.speakersCollection.add(speaker) ;
  }

  removeSpeaker(speaker: SPEAKER) {
    const id = speaker.id;
    this.speakerDoc = this.db.doc(`speakers/${id}`);
    this.speakerDoc.delete();
  }

  updateSpeaker(speaker: SPEAKER) {
    const id = speaker.id;
    this.speakerDoc = this.db.doc(`speakers/${id}`);
    delete(speaker.id);
    this.speakerDoc.update(speaker);
    speaker.id = id;
  }

  addSessionInSpeaker(id: string, session: SESSION) {
    this.getSpeakerByID(id).then(speaker => {
      speaker.sessions.push({ id: session.id, name: session.name });
      speaker.id = id;
      this.updateSpeaker(speaker);
    })
  }

  removeSessionFromSpeaker(id: string, session: SESSION) {
    this.getSpeakerByID(id).then(speaker => {
      const idx = speaker.sessions.findIndex(s => s.id === session.id);
      speaker.id = id;
      if (idx > -1) {
        speaker.sessions.splice(idx, 1);
        this.updateSpeaker(speaker);
      }
    })
  }
}
