import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  { path: 'tabs', component: TabsPage,
    children: [
      { path: 'schedule',
        children: [
          { path: '', loadChildren: '../pages/schedule/schedule.module#SchedulePageModule' }
        ]
      },
      { path: 'speakers',
        children: [
          { path: '', loadChildren: '../pages/speakers/speakers.module#SpeakersPageModule' }
        ]
      },
      { path: 'map',
        children: [
          { path: '', loadChildren: '../pages/map/map.module#MapPageModule' }
        ]
      },
      { path: 'about',
        children: [
          { path: '', loadChildren: '../pages/about/about.module#AboutPageModule' }
        ]
      },
      { path: 'notfound',
        children: [
          { path: '', loadChildren: '../pages/notfound/notfound.module#NotfoundPageModule' }
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
