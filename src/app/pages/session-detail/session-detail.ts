import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { SESSION, USER } from 'src/app/models';
import { SessionService } from 'src/app/providers/session.service';
import { GeneralService } from 'src/app/providers/general.service';
import { UserService } from 'src/app/providers/user.service';

@Component({
  selector: 'page-session-detail',
  styleUrls: ['./session-detail.scss'],
  templateUrl: 'session-detail.html'
})
export class SessionDetailPage {
  session: SESSION;
  user: USER;
  isFavorite = false;
  parent: string;

  constructor(private sessionService: SessionService,
              private genService: GeneralService,
              private userService: UserService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {}

  ionViewWillEnter() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.parent = this.activatedRoute.snapshot.paramMap.get('parent');
    this.sessionService.getSessionById(id)
      .then( data => {
        data.id = id;
        this.session = data;
        this.genService.getUser().then(user => {
          this.user = user;
          this.user.favorites.forEach(favorite => {
            if (favorite.id === this.session.id) { this.isFavorite = true; }
          });
        });
      }
    );
  }

  toggleFavorite() {
    if (this.isFavorite) {
      const index = this.user.favorites.findIndex(f => f.id === this.session.id);
      if (index > -1) {
        this.user.favorites.splice(index, 1);
      }
    } else {
      this.user.favorites.push({id: this.session.id, name: this.session.name });
    }
    this.userService.updateUser(this.user);
    this.genService.setUser(this.user);
    this.isFavorite = !this.isFavorite;
  }

  navigateBack() {
    this.router.navigate([`/tabs/${this.parent}`]);
  }
}
