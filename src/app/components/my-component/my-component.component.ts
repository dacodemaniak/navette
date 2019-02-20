import { ResaSharingService } from 'src/app/shared/services/resa-sharing.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TourneeInterface } from './../../shared/interfaces/tournee';
import { ResaModel } from 'src/app/shared/models/resa-model';

import * as moment from 'moment';

@Component({
  selector: 'app-my-component',
  templateUrl: './my-component.component.html',
  styleUrls: ['./my-component.component.scss']
})
export class MyComponentComponent implements OnInit {
  @Input() tour: TourneeInterface ;
  @Output() places: EventEmitter<any> = new EventEmitter<any>();

  // tslint:disable-next-line:no-inferrable-types
  public nbPlaces: number = 1;

  // tslint:disable-next-line:no-inferrable-types
  public isMini: boolean = true;

  // tslint:disable-next-line:no-inferrable-types
  public isMaxi: boolean = false;

  // tslint:disable-next-line:no-inferrable-types
  public isPast: boolean = false;

  constructor() { }

  ngOnInit() {
    const today: moment.Moment = moment();
    this.isPast = this.tour.hour.isBefore(today, 'minute');
  }

  public increment(): void {
    this.nbPlaces++;

    this.isMini = false;

    if (this.nbPlaces === this.tour.dispo) {
      this.isMaxi = true;
    }

    this.sendIt();
  }

  public decrement(): void {
    this.nbPlaces--;

    this.isMaxi = false;

    if (this.nbPlaces === 1) {
      this.isMini = true;
    }

    this.sendIt();
  }

  private sendIt(): void {
    this.places.emit(
      {
        tour: this.tour,
        places: this.nbPlaces
      }
    );
  }
}
