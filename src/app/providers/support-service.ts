import { Injectable } from '@angular/core';
import { Events } from '@ionic/angular';
import { AngularFirestore,
         AngularFirestoreCollection,
         AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SUPPORT } from '../models';
import { FunctionService } from './function.service';
import { GeneralService } from './general.service';

@Injectable({
  providedIn: 'root'
})
export class SupportService {
  supportsCollection: AngularFirestoreCollection<SUPPORT> ;
  supportDoc: AngularFirestoreDocument<SUPPORT> ;
  supports: Observable<SUPPORT[]> ;
  support: Observable<SUPPORT> ;

  constructor(private db: AngularFirestore,
              private funService: FunctionService,
              private genService: GeneralService,
              public events: Events) {
    this.supportsCollection = this.db.collection(
      'supports', ref => ref.orderBy('date', 'asc'));
  }

  getSupports(): Observable<SUPPORT[]> {
    this.supports = this.supportsCollection.snapshotChanges()
      .pipe(map(response => {
        return response.map(action => {
          const data = action.payload.doc.data() as SUPPORT;
          data.id = action.payload.doc.id;
          return data;
        });
      }));
    return this.supports;
  }

  addSupport(message: string) {
    const date = this.funService.getDateFormat(null);
    this.genService.getUser()
      .then(user => {
        const support: SUPPORT = {
          date: date,
          userId: user.id,
          support: message
        };
        this.supportsCollection.add(support);
      });
  }
}
