import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { USER } from 'src/app/models';
import { UserService } from 'src/app/providers/user.service';
import { GeneralService } from 'src/app/providers/general.service';
import { FunctionService } from 'src/app/providers/function.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginKeyword = '';
  password = '';
  submitted = false;
  users: USER[] = [];

  constructor(private userService: UserService,
              private genService: GeneralService,
              private funcService: FunctionService,
              private router: Router) { }

  ngOnInit() {
    this.userService.getUsers().subscribe(res => {
      this.users = res;
    });
  }

  onLogin(form: NgForm) {
    this.submitted = true;
    if (form.valid) {
      const user = this.findUser(this.loginKeyword.toLowerCase().trim());
      if (user) {
        if (user.password === this.password) {
          this.genService.login(user).then(() => {
            this.router.navigate(['/tabs/schedule']);
          });
        } else {
          this.funcService.onError('Confirm Login', 'Invalid password. Try another.');
        }
      } else {
        this.funcService.onError('Confirm Login', 'User not found. Try again.');
      }

    }
  }

  findUser(keyInfo: string): USER {
    if (keyInfo.includes('@')) {
      return this.users.find(user => user.email.toLowerCase() === keyInfo);
    } 
    return this.users.find(user => user.username.toLowerCase() === keyInfo);
  }

  onSignup() {
    this.router.navigate(['/signup']);
  }
}
