import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { UserService } from '../../providers/user.service';
import { GeneralService } from '../../providers/general.service';
import { USER } from '../../models';

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


  constructor() { }

  ngOnInit() {
  }
}
