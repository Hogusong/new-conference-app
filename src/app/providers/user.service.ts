import { Injectable } from '@angular/core';
import { USER } from '../models';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  users: USER[] = [
    { id: '0', username: 'Joe', password: '1111', email: 'joe@gmail.com', favorites: [], trackFilter: [] },
    { id: '1', username: 'Cassidy', password: '2222', email: 'cassidy@gmail.com', favorites: [], trackFilter: [] },
    { id: '2', username: 'Randy', password: '3333', email: 'ran@gmail.com', favorites: [], trackFilter: [] },
    { id: '3', username: 'Narae', password: '4444', email: 'narae@gmail.com', favorites: [], trackFilter: [] }
  ];

  constructor() { }

  getUsers() {
    return this.users;
  }

  getUserById(id: string) {
    return this.users[+id];
  }

  addUser(user: USER): Promise<USER> {
    user.id = '' + this.users.length;
    this.users.push(user);
    console.log('New user :', user);
    return new Promise((res, rej) => res(user));
  }

  updateUser(user: USER) {
    this.users[+user.id] = user;
    console.log('updated:', this.users[+user.id]);
  }

  removeUser(user: USER) {
    console.log('Delete user:', user);
  }
}
