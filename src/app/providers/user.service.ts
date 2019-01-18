import { Injectable } from '@angular/core';
import { USER } from '../models';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  addUser(user: USER): Promise<boolean> {
    console.log('New user :', user);
    return new Promise((res, rej) => res(true));
  }
}
