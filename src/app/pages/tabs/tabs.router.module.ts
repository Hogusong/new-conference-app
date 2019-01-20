import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  { path: 'tabs', component: TabsPage,
    children: [
      { path: 'schedule',
        children: [
          { path: '', loadChildren: '../schedule/schedule.module#SchedulePageModule' }
        ]
      },
      { path: 'speakers',
        children: [
          { path: '', loadChildren: '../speakers/speakers.module#SpeakersPageModule' }
        ]
      },
      { path: 'map',
        children: [
          { path: '', loadChildren: '../map/map.module#MapPageModule' }
        ]
      },
      { path: 'about',
        children: [
          { path: '', loadChildren: '../about/about.module#AboutPageModule' }
        ]
      },
      { path: 'notfound',
        children: [
          { path: '', loadChildren: '../notfound/notfound.module#NotfoundPageModule' }
        ]
      },
      { path: '', redirectTo: '/tabs/schedule', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: '/tabs/schedule', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsRoutingModule {}
