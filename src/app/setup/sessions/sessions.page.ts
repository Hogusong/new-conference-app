import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

import { SESSION } from 'src/app/models';
import { SessionService } from 'src/app/providers/session.service';
import { GeneralService } from 'src/app/providers/general.service';
import { FunctionService } from 'src/app/providers/function.service';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.page.html',
  styleUrls: ['./sessions.page.scss'],
})
export class SessionsPage implements OnInit {

  startDate = '2000-01-01';
  endDate = '2100-12-31';
  queryText = '';
  sessions: SESSION[];

  constructor(private sessionService: SessionService,
              private genService: GeneralService,
              private funService: FunctionService,
              private alertCtrl: AlertController,
              private modalCtrl: ModalController,
              private router: Router) { }

  ngOnInit() {
    this.genService.getUser().then(user => {
      if ( !user || user.username !== 'admin') {
        this.router.navigateByUrl('/tutorial');
      } else {
        this.genService.getPeriod().then(period => {
          if (period) {
            this.startDate = period.start;
            this.endDate = period.end;
            this.getSessions();
          } else {
            this.getDatePeriod();
          }
        })
      }
    })
  }

  getSessions() {
    this.sessionService.getSessionsInPeriod(this.startDate, this.endDate)
      .subscribe(data => { this.sessions = data; });
  }

  async getDatePeriod() {
    console.log('will get period');
  }

  async onConfirmToRemove(session: SESSION) {
    const alert = await this.alertCtrl.create({
      header: 'Confirm Remove',
      message: `Are you sure to remove ${session.name}?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.router.navigateByUrl('setup/tabs/sessions');
          }
        },
        {
          text: 'Remove',
          handler: () => {
            this.sessionService.removeSession(session);
            this.router.navigateByUrl('setup/tabs/sessions');
          }
        }
      ],
      backdropDismiss: false
    });
    await alert.present();
  }

  navigate(mode: string) {
    this.router.navigate(['/setup/tabs/sessions/edit', mode]);
  }
}
