import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { FunctionService } from 'src/app/providers/function.service';

@Component({
  selector: 'period',
  templateUrl: './period.page.html',
  styleUrls: ['./period.page.scss'],
})
export class PeriodPage implements OnInit {

  start: string;
  end: string;
  minYear: string;
  maxYear: string;

  constructor(private navParams: NavParams,
              private modalCtrl: ModalController,
              private cdRef: ChangeDetectorRef,
              private funService: FunctionService) { }

  ngOnInit() {
    this.start = this.navParams.get('start');
    this.end = this.navParams.get('end');
    this.minYear = '' + (+this.start.substring(0, 4) - 20);
    this.maxYear = '' + (+this.end.substring(0, 4) + 20);
  }

  checkStartDate(value) {
    this.cdRef.detectChanges();
    if (this.funService.checkDateValidation(value)) {
      this.end = (this.end < value) ? value : this.end;
    } else {
      this.funService.onError('Confirm Date', 'The date is not valid. Try again.');
      this.start = this.navParams.get('start');
    }
  }

  checkEndDate(value) {
    this.cdRef.detectChanges();
    if (!this.funService.checkDateValidation(value)) {
      this.funService.onError('Confirm Date', 'The date is not valid. Try again.');
      this.end = this.start;
    } else if (this.start > value) {
      this.funService.onError('Confirm Date', 'The end of period is wrong. Try again.');
      this.end = this.start;
    }
  }

  applySelection() {
    this.modalCtrl.dismiss({ start: this.start, end: this.end });
  }

  onExit() {
    this.modalCtrl.dismiss(null);
  }
}
