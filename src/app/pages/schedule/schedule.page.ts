import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
})
export class SchedulePage {

  constructor(private storage: Storage,
              private router: Router) { }

  ionViewWillEnter() {
    this.storage.get('did_tutorial').then( res => {
      if (!res) {
        this.router.navigate(['/tutorial'])
      }
    })
  }
}
