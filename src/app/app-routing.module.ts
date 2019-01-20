import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  // { path: '', redirectTo: '/app', pathMatch: 'full' },
  { path: '', loadChildren: './pages/tabs/tabs.module#TabsPageModule' },
  { path: 'account', loadChildren: './pages/account/account.module#AccountPageModule' },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'suport', loadChildren: './pages/suport/suport.module#SuportPageModule' },
  { path: 'signup', loadChildren: './pages/signup/signup.module#SignupPageModule' },
  { path: 'tutorial', loadChildren: './pages/tutorial/tutorial.module#TutorialPageModule' },
  { path: 'setup', loadChildren: './setup/tabs-setup/tabs-setup.module#TabsSetupPageModule' },
  { path: '**', redirectTo: '/tabs/notfound' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

  // { path: 'tabs-setup', loadChildren: './setup/tabs-setup/tabs-setup.module#TabsSetupPageModule' },
  // { path: 'sessions', loadChildren: './setup/sessions/sessions.module#SessionsPageModule' },
  // { path: 'set-speakers', loadChildren: './setup/set-speakers/set-speakers.module#SetSpeakersPageModule' },
  // { path: 'set-map', loadChildren: './setup/set-map/set-map.module#SetMapPageModule' },
  // { path: 'tracks', loadChildren: './setup/tracks/tracks.module#TracksPageModule' },
  // { path: 'partofday', loadChildren: './setup/partofday/partofday.module#PartofdayPageModule' },
  // { path: 'support', loadChildren: './setup/support/support.module#SupportPageModule' }
