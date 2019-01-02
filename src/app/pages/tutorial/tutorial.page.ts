import { Component, ViewChild } from '@angular/core';
import { IonSlides, MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.page.html',
  styleUrls: ['./tutorial.page.scss'],
})
export class TutorialPage {

  showSkip = true;
  @ViewChild('slides') slides: IonSlides

  constructor(private router: Router,
              private menuCtrl: MenuController,
              private storage: Storage) { }

  startApp() {
    this.router.navigate(['/tabs/schedule'])
      .then(() => this.storage.set('did_tutorial', true))
  }

  onSlideChangeStart(event) {
    event.target.isEnd().then(isEnd => {
      this.showSkip = !isEnd;
    });
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  ionViewDidLeave() {
    this.menuCtrl.enable(true);
  }
}
