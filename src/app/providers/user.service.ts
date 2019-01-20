import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { USER } from '../models';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  usersCollection: AngularFirestoreCollection<USER>;
  userDoc: AngularFirestoreDocument<USER>;
  users: Observable<USER[]>;

  constructor(private db: AngularFirestore,
              private fireStorage: AngularFireStorage,
              public storage: Storage) {
    this.usersCollection = this.db.collection(
      'users', ref => ref.orderBy('username', 'asc'));
  }

  getUsers(): Observable<USER[]> {
    return this.usersCollection.snapshotChanges()
      .pipe(map(response => {
        return response.map(action => {
          const data = action.payload.doc.data() as USER;
          data.id = action.payload.doc.id;
          return data;
        });
      }));
  }

  getUserById(id: string): Promise<USER> {
    return this.usersCollection.doc(id).ref.get()
      .then(doc => {
        const user = doc.data() as USER;
        user.id = id;
        if (user.avatar) {
          // download image from firebase storage.
          this.fireStorage.ref(user.avatar).getDownloadURL().subscribe(url => {
            user.avatar = url;
          });
        }
      return user;
    });
  }

  // return result including user's ID.
  addUser(user: USER): Promise<any> {
    return this.usersCollection.add(user);
  }

  updateUser(user: USER) {
    const id = user.id;
    delete(user.id);
    this.userDoc = this.db.doc(`users/${id}`);
    this.userDoc.update(user);

    // save user's info to ionic storage.
    user.id = id;
    this.setUser(user);
  }

  removeUser(user: USER) {
    this.userDoc = this.db.doc(`users/${user.id}`);
    this.userDoc.delete();
  }

  addTrackInUser(name) {
    const track = { name: name, isChecked: true };
    this.getUsers().subscribe(users => {
      users.forEach(user => {
        const idx = user.trackFilter.findIndex(item => item.name === name);
        if (idx < 0) {
          user.trackFilter.push(track);
          this.updateUser(user);
        }
      });
    });
  }

  updateTracksInUser(newName: string, oldName: string) {
    this.getUsers().subscribe(users => {
      users.forEach(user => {
        const idx = user.trackFilter.findIndex(track => track.name === oldName);
        if (idx > -1) {
          user.trackFilter[idx].name = newName;
          this.updateUser(user);
        }
      });
    });
  }

  removeTrackInUser(name) {
    this.getUsers().subscribe(users => {
      users.forEach(user => {
        const idx = user.trackFilter.findIndex(track => track.name === name);
        if (idx > -1) {
          user.trackFilter.splice(idx, 1);
          this.updateUser(user);
        }
      });
    });
  }

  setUser(user: USER): Promise<USER> {
    return this.storage.set('user', user);
  }

  getUser(): Promise<USER> {
    return this.storage.get('user');
  }
}
