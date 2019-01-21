import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsSetupPage } from './tabs-setup';

const routes: Routes = [
  { path: 'tabs', component: TabsSetupPage,
    children: [
      { path: 'sessions',
        children: [
          { path: '', loadChildren: '../sessions/sessions.module#SessionsPageModule' },
          // { path: 'edit/:mode', loadChildren: '' }
        ]
      },
      { path: 'set-speakers',
        children: [
          { path: '', loadChildren: '../set-speakers/set-speakers.module#SetSpeakersPageModule' },
          { path: 'edit/:id', loadChildren: '../set-speakers/speaker-edit/speaker-edit.module#SpeakerEditPageModule' },
        ]
      },
      { path: 'tracks',
        children: [
          { path: '', loadChildren: '../tracks/tracks.module#TracksPageModule' },
        ]
      },
      { path: 'partofday',
        children: [
          { path: '', loadChildren: '../partofday/partofday.module#PartofdayPageModule' },
          { path: 'new', loadChildren: '../partofday/new-pod/new-pod.module#NewPodPageModule' }
        ]
      },
      { path: 'set-map',
        children: [
          { path: '', loadChildren: '../set-map/set-map.module#SetMapPageModule' },
          // { path: 'edit/:mode', loadChildren: '' }
        ]
      },
      { path: 'support',
        children: [
          { path: '', loadChildren: '../support/support.module#SupportPageModule' },
          // { path: 'edit/:mode', loadChildren: '' }
        ]
      },
      { path: 'notfound',
        children: [
          { path: '', loadChildren: '../../pages/notfound/notfound.module#NotfoundPageModule' }
        ]
      },
      { path: '', redirectTo: '/setup/tabs/sessions', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: '/setup/tabs/sessions', pathMatch: 'full' }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsSetupRoutingModule {}