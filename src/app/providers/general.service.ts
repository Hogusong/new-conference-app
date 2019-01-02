import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { USER } from '../models';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  IS_LOGGED_IN = 'is_logged_in'

  constructor(private storage: Storage,
              private userService: UserService) { }

  isLoggedIn(): Promise<any> {
    return this.storage.get(this.IS_LOGGED_IN);
  }

  login(user: USER): Promise<any> {
    return this.storage.set(this.IS_LOGGED_IN, true)
      .then(() => this.storage.set('user', user));
  }

  logout(): Promise<any> {
    return this.storage.set(this.IS_LOGGED_IN, false)
      .then(() => this.storage.remove('user'));
  }

  signup(user: USER): Promise<any> {
    return this.userService.addUser(user).then(() => this.login(user));
  }

  getUser(): Promise<USER> {
    return this.storage.get('user');
  }
}
