import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { TabsSetupPage } from './tabs-setup';

import { TabsSetupRoutingModule } from './tabs-setup.router.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabsSetupRoutingModule
  ],
  declarations: [TabsSetupPage]
})
export class TabsSetupPageModule {}
