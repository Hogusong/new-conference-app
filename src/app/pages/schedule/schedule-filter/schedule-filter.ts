import { AfterViewInit, Component, ViewEncapsulation } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { USER } from 'src/app/models';
import { GeneralService } from 'src/app/providers/general.service';
import { UserService } from 'src/app/providers/user.service';


@Component({
  selector: 'page-schedule-filter',
  templateUrl: 'schedule-filter.html',
  styleUrls: ['schedule-filter.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ScheduleFilterPage implements AfterViewInit {
  user: USER;
  trackFilter: { name: string, isChecked: boolean }[] = [];

  constructor(private genService: GeneralService,
              private userServoice: UserService,
              private modalCtrl: ModalController,
  ) { }

  // TODO use the ionViewDidEnter event
  ngAfterViewInit() {
    this.genService.getUser().then(user => {
      this.user = user;
      this.trackFilter = user.trackFilter.sort((a,b) => {
        if (a.name > b.name) { return 1 }
        return -1
      });
    });
  }

  selectAllTracks() {
    // reset all of the toggles to be checked
    this.trackFilter.forEach(track => {
      track.isChecked = true;
    });
  }

  applyFilters() {
    // update user's trackFilter
    this.user.trackFilter = this.trackFilter;
    // update loggin user and then update database file.
    this.genService.setUser(this.user).then(() => {
      this.userServoice.updateUser(this.user);
    });

    // Pass back a new array of track names to exclude
    const excludedTrackNames = this.trackFilter.filter(c => !c.isChecked).map(c => c.name);
    this.dismiss(excludedTrackNames);
  }

  dismiss(data: any) {
    // using the injected ModalController this page
    // can "dismiss" itself and pass back data
    this.modalCtrl.dismiss(data);
  }
}
