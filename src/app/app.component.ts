import { Component } from '@angular/core';

import { Platform, Events, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  pages = [
    { title: 'Schedule', url: '/tabs/schedule', icon: 'calendar' },
    { title: 'Speakers', url: '/tabs/speakers', icon: 'contacts' },
    { title: 'Map', url: '/tabs/map', icon: 'map' },
    { title: 'About', url: '/tabs/about', icon: 'information-cicle' },
  ];
  loggedIn: boolean = true;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private events: Events,
    private menuCtrl: MenuController
  ) {
    this.initializeApp();
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

  logout() {
    this.loggedIn = false;
    return this.openTutorial();
  }

  openTutorial() {
    this.menuCtrl.close();
    this.router.navigateByUrl('/tutorial')
  }

}
