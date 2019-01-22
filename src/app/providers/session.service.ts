import { Injectable } from '@angular/core';
import { AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SESSION } from '../models';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  sessionsCollection: AngularFirestoreCollection<SESSION> ;
  sessionDoc: AngularFirestoreDocument<SESSION> ;

  constructor(private db: AngularFirestore) {}

  getSessionsInPeriod(start, end): Observable<SESSION[]> {
    this.sessionsCollection = this.db.collection(
      'sessions', ref => ref.where('date', '>=', start)
                            .where('date', '<=', end)
                            .orderBy('date', 'asc'));
    return this.sessionsCollection.snapshotChanges()
      .pipe(map(response => {
        return response.map(action => {
          const data = action.payload.doc.data() as SESSION;
          data.id = action.payload.doc.id;
          return data;
        });
      }));
  }

  getSessions(): Observable<SESSION[]> {
    this.sessionsCollection = this.db.collection(
      'sessions', ref => ref.orderBy('date', 'asc'));
    return this.sessionsCollection.snapshotChanges()
      .pipe(map(response => {
        return response.map(action => {
          const data = action.payload.doc.data() as SESSION;
          data.id = action.payload.doc.id;
          return data;
        });
      }));
  }

  addNewSession(session: SESSION) {
    return this.sessionsCollection.add(session)
      .then(docRef => docRef.id )
  }

  updateSession(session: SESSION) {
    const id = session.id;
    delete(session.id);
    this.sessionDoc = this.db.doc(`sessions/${id}`);
    this.sessionDoc.update(session);
    session.id = id;
  }

  removeSession(session: SESSION) {
    this.sessionDoc = this.db.doc(`sessions/${session.id}`);
    this.sessionDoc.delete();
  }

  getSessionById(id: string): Promise<any> {
    return this.sessionsCollection.doc(id).ref.get()
      .then(doc => {
        const session = doc.data() as SESSION ;
        session.id = id;
        return session;
      });
  }

  updateTrackInSessions(newName: string, oldName: string) {
    this.getSessions().subscribe(sessions => {
      sessions.forEach(session => {
        const idx = session.tracks.findIndex(track => track === oldName);
        if (idx > -1) {
          session.tracks[idx] = newName;
          this.updateSession(session);
        }
      });
    });
  }

  removeTrackInSession(name: string) {
    this.getSessions().subscribe(sessions => {
      sessions.forEach(session => {
        const idx = session.tracks.findIndex(track => track === name);
        if (idx > -1) {
          session.tracks.splice(idx, 1);
          this.updateSession(session);
        }
      });
    });
  }
}
