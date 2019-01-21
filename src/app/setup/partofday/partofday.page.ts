import { Component, OnInit } from '@angular/core';
import { PARTOFDAY } from 'src/app/models';
import { GeneralService } from 'src/app/providers/general.service';
import { FunctionService } from 'src/app/providers/function.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-partofday',
  templateUrl: './partofday.page.html',
  styleUrls: ['./partofday.page.scss'],
})
export class PartofdayPage implements OnInit {

  PODs: PARTOFDAY[];
  makeNew = false;

  constructor(private genService: GeneralService,
              private funService: FunctionService,
              private alertCtrl: AlertController,
              private router: Router) { }

  ngOnInit() {
    this.genService.getPartsOfDay().subscribe(res => {
      this.PODs = res;
    });
  }

  makeNewPOD() {
    this.router.navigate(['/setup/tabs/partofday/new'])
  }

  async editTitle(pod) {
    const changeForm = await this.alertCtrl.create({
      header: 'Change Description',
      subHeader: pod.name,
      buttons: [
        'Cancel',
        {
          text: 'Ok',
          handler: (data: any) => {
            data.newName = data.newName.trim();
            if (this.isTheValueUsed(data.newName)) {
              this.funService.onError('Part Of Day', data.newName + ' was used already. Try another.');
            } else {
              pod.name = data.newName;
              this.genService.updatePartOfDay(pod);
            }
          }
        }
      ],
      inputs: [
        {
          type: 'text',
          name: 'newName',
          placeholder: 'new descrition here'
        }
      ],
      backdropDismiss: false
    });
    await changeForm.present();
  }

  isTheValueUsed(name) {
    return this.PODs.find(pod => pod.name.toLowerCase() === name.toLowerCase());
  }
  
  convertFormat(time) {
    return this.funService.timeFormat24to12(time);
  }
}
