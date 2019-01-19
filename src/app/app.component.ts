import { Component, OnInit } from '@angular/core';

import { Platform, Events } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { GeneralService } from './providers/general.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit{
  pages = [
    { title: 'Schedule', url: '/tabs/schedule', icon: 'calendar' },
    { title: 'Speakers', url: '/tabs/speakers', icon: 'contacts' },
    { title: 'Map', url: '/tabs/map', icon: 'map' },
    { title: 'About', url: '/tabs/about', icon: 'information-cicle' }
  ];
  loggedIn = false ;
  username = '' ;

  constructor(private platform: Platform,
              private splashScreen: SplashScreen,
              private statusBar: StatusBar,
              private router: Router,
              private generalService: GeneralService,
              private events: Events) {
    this.initializeApp();
  }

  ngOnInit() {
    this.generalService.isLoggedIn().then(res => {
      this.updateLoggedInStatus(res);
    })
    this.listenForLoginEvents();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  updateLoggedInStatus(loggedIn: boolean) {
    this.loggedIn = loggedIn;
    this.generalService.getUser().then(user => {
      this.username = user ? user.username : '';
    });
  }

  listenForLoginEvents() {
    this.events.subscribe('user:login', () => {
      this.updateLoggedInStatus(true);
    });

    this.events.subscribe('user:logout', () => {
      this.updateLoggedInStatus(false);
    });
  }

  navigate(url) {
    this.router.navigate([url]);
  }

  logout() {
    this.generalService.logout().then(() => {
      this.loggedIn = false;
      this.username = '';
    });
    this.openTutorial();
  }

  openTutorial() {
    this.router.navigateByUrl('/tutorial');
  }
}
