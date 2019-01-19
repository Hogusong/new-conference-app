import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { USER, TRACK } from '../../models';
import { UserService } from '../../providers/user.service';
import { GeneralService } from '../../providers/general.service';
import { FunctionService } from 'src/app/providers/function.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  users: USER[];
  signup: USER = {
    username: '', password: '', email: '', favorites: [], trackFilter: []
  };
  tracks: TRACK[];

  header = 'Confirm Signup';
  confirmPassword = '';
  submitted = false;

  constructor(private router: Router,
              private userService: UserService,
              private genService: GeneralService,
              private funService: FunctionService) { }

  ngOnInit() {
    this.userService.getUsers().subscribe(res => { this.users = res; });
    this.genService.getTracks().subscribe(res => { this.tracks = res; });
  }

  onSignup(form: NgForm) {
    this.submitted = true;
    if (form.valid && this.signup.password === this.confirmPassword) {
      if (this.signup.username.trim().length < 4) {
        this.funService.onError(this.header, 'Name should has more then 3 letters. Try again.');
      } else if (this.isNameUsed(this.signup.username)) {
        this.funService.onError(this.header, 'Name is already taken. Try another.');
      } else if (this.isEmailUsed(this.signup.email)) {
        this.funService.onError(this.header, 'Email is already taken. Try another.');
      } else {
        this.setTrackFilter();
        this.genService.signup(this.signup).then(res => {
          this.signup.id = res.id;
          this.genService.login(this.signup);
          this.router.navigate(['/tabs/schedule']);
        });
      }
    }
  }

  setTrackFilter() {
    this.tracks.forEach(track => {
      this.signup.trackFilter.push({ name: track.name, isChecked: true });
    });
  }

  isNameUsed(name) {
    return this.users.find(ur => ur.username.toLowerCase() === name.toLowerCase());
  }

  isEmailUsed(email) {
    return this.users.find(ur => ur.email.toLowerCase() === email.toLowerCase());
  }
}
