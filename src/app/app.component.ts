import { Component } from '@angular/core';

import { Platform, Events } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { USER } from './models';
import { GeneralService } from './providers/general.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  pages = [
    { title: 'Schedule', url: '/tabs/schedule', icon: 'calendar' },
    { title: 'Speakers', url: '/tabs/speakers', icon: 'contacts' },
    { title: 'Map', url: '/tabs/map', icon: 'map' },
    { title: 'About', url: '/tabs/about', icon: 'information-cicle' }
  ];
  loggedIn: boolean = false;
  username: string = '';

  constructor(private platform: Platform,
              private splashScreen: SplashScreen,
              private statusBar: StatusBar,
              private router: Router,
              private generalService: GeneralService,
              private storage: Storage,
              private events: Events) {
    this.initializeApp();
    this.generalService.isLoggedIn().then((res) => {
      this.loggedIn = res;
      this.generalService.getUser().then(user => {
        if (user) { this.username = user.username; }
      });
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  navigate(url) {
    this.router.navigate([url]);
  }

  login() {
    const user = { 
      username: 'admin', password: '1111', email: 'abc@abc.com',
      favorites: [],     trackFilter: []
    }
    this.generalService.login(user).then(() => {
      this.generalService.isLoggedIn().then((res) => {
        this.loggedIn = res;
        this.generalService.getUser().then(user => this.username = user.username);
      });
      this.router.navigate(['/tabs/schedule']);
    });
  }

  logout() {
    this.generalService.logout().then(() => this.loggedIn = false );
    return this.openTutorial();
  }

  openTutorial() {
    this.router.navigateByUrl('/tutorial')
  }
}
