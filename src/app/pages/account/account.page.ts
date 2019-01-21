import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/providers/user.service';
import { USER } from 'src/app/models';
import { AlertController } from '@ionic/angular';
import { FunctionService } from 'src/app/providers/function.service';
import { GeneralService } from 'src/app/providers/general.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  header = `User's Info`;
  jobDescription = '';
  succeed: boolean;
  uploadImage = false;
  users: USER[];
  user: USER;

  constructor(private userService: UserService,
              private funService: FunctionService,
              private genService: GeneralService,
              private alertCtrl: AlertController,
              private router: Router) { }

  ngOnInit() {
    this.userService.getUsers().subscribe(res => this.users = res);
    this.genService.getUser().then(res => this.user = res);    
  }

  async changeUsername() {
    this.succeed =  false;
    const changeForm = await this.alertCtrl.create({
      header: 'Change Username',
      buttons: [
        'Cancel',
        {
          text: 'Ok',
          handler: (data: any) => {
            if (data.username.trim().length < 4) {
              this.funService.onError(this.header, 'Username should has more then 3 letters. Try again.');
            } else {
              if (this.isTheValueUsed(data.username)) {
                this.funService.onError(this.header, data.username + ' was used already. Try another.');
              } else {
                // update after getter user's avatar as string.
                this.genService.getUser().then(user => {
                  user.username = data.username;
                  this.updateUserData(user);
                });
                this.user.username = data.username;
                this.succeed = true;
                this.jobDescription = 'Username has been changed.';
              }
            }
          }
        }
      ],
      inputs: [
        {
          type: 'text',
          name: 'username',
          value: this.user.username,
          placeholder: 'new username'
        }
      ],
      backdropDismiss: false
    });
    await changeForm.present();
  }

  async changeEmail() {
    this.succeed = false;
    const changeForm = await this.alertCtrl.create({
      header: 'Change Email',
      buttons: [
        'Cancel',
        {
          text: 'Ok',
          handler: (data: any) => {
            if (this.isTheValueUsed(data.email)) {
              this.funService.onError(this.header, data.email + ' was used already. Try another.');
            } else {
              // update after getter user's avatar as string.
              this.genService.getUser().then(user => {
                user.email = data.email;
                this.updateUserData(user);
                this.user.email = data.email;
                this.succeed = true;
                this.jobDescription = 'Email has been changed.';
              });
            }
          }
        }
      ],
      inputs: [
        {
          type: 'email',
          name: 'email',
          value: this.user.email,
          placeholder: 'new email'
        }
      ],
      backdropDismiss: false
    });
    await changeForm.present();
  }

  async changePassword() {
    this.succeed = false;
    const changeForm = await this.alertCtrl.create({
      header: 'Change Password',
      buttons: [
        'Cancel',
        {
          text: 'Ok',
          handler: (data: any) => {
            if (this.user.password !== data.currentPW) {
              this.funService.onError(this.header, 'Current password does not match your password.');
            } else if (data.newPW.length < 4) {
              this.funService.onError(this.header, 'Password should be more than 3 characters.');
            } else if (data.newPW !== data.confirmPW) {
              this.funService.onError(this.header, 'New password does not match Confirm password.');
            } else {
              // update after getter user's avatar as string.
              this.genService.getUser().then(user => {
                user.password = data.newPW;
                this.updateUserData(user);
                this.user.password = data.newPW;
                this.succeed = true;
                this.jobDescription = 'Password has been changed.';
              });
            }
          }
        }
      ],
      inputs: [
        {
          type: 'password',
          name: 'newPW',
          placeholder: 'new password'
        },
        {
          type: 'password',
          name: 'confirmPW',
          placeholder: 'confirm password'
        },
        {
          type: 'password',
          name: 'currentPW',
          placeholder: 'current password'
        }
      ],
      backdropDismiss: false
    });
    await changeForm.present();
  }

  isTheValueUsed(value: string) {
    if (value.indexOf('@') < 0) {
      return this.users.find(
        user => user.username.toLowerCase() === value.toLowerCase());
    }
    return this.users.find(
      user => user.email.toLowerCase() === value.toLowerCase());
  }

  updateUserData(user) {
    // update logged user info after update user's database
    this.genService.setUser(user).then(() => {
      this.userService.updateUser(user);
    });
  }

  logout() {
    this.genService.logout();
    this.router.navigateByUrl('/login');
  }
}
