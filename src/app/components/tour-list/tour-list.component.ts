import { DaoResa } from './../../shared/models/dao-resa';
import { ResaModel } from './../../shared/models/resa-model';

import { TourneesService } from './../../shared/services/tournees.service';
import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { TourneeInterface } from './../../shared/interfaces/tournee';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
import { PaymentDialogComponent } from './../payment-dialog/payment-dialog.component';

import * as moment from 'moment';
import { ResaService } from 'src/app/shared/services/resa.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tour-list',
  templateUrl: './tour-list.component.html',
  styleUrls: ['./tour-list.component.scss']
})
export class TourListComponent implements OnInit, OnDestroy {
  public tournees: Array<TourneeInterface>;
  // tslint:disable-next-line:no-inferrable-types
  public progress: boolean = true;

  /**
   * Date du jour de la première tournée récupérée
   * singleton
   */
  public tourDate: moment.Moment;

  /**
   * Date courante de la tournée, variable
   */
  public currentDisplayTour: moment.Moment;

  /**
   * Contrôles d'activation des boutons suivant et précédent
   */
  // tslint:disable-next-line:no-inferrable-types
  public isLastDay: boolean = false;
  // tslint:disable-next-line:no-inferrable-types
  public isFirstDay: boolean = true;

  private tourSubscription: Subscription;

  constructor(
    private tourneeService: TourneesService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.apiCall(); // Appel API sans paramètres, première tournée
  }

  ngOnDestroy() {
    this.tourSubscription.unsubscribe();
    console.log('Au revoir tourList');
  }

  public nextTour(): void {
    const nextTour: moment.Moment = this.currentDisplayTour.clone().add(1, 'day');
    if (nextTour.isSame(this.tourDate.clone().add(7, 'day'), 'day')) {
      this.isLastDay = true;
    }
    this.isFirstDay = false;
    this.apiCall(nextTour);
  }

  public previousTour(): void {
    const previousTour: moment.Moment = this.currentDisplayTour.clone().subtract(1, 'day');
    if (previousTour.isSame(this.tourDate.clone(), 'day')) {
      this.isFirstDay = true;
    }
    this.isLastDay = false;
    this.apiCall(previousTour);
  }

  public isDisabled(tour: TourneeInterface): boolean {
    const today: moment.Moment = moment();
    return tour.hour.isBefore(today, 'minute') || tour.dispo === 0;
  }

  public receivePlaces(places: any): void {
    console.log('Places demandées : ' + places.places);
    this.tournees[this.tournees.indexOf(places.tour)].resa = places.places;
  }

  public openPaymentDialog(tour: TourneeInterface): void {
    const dialogRef = this.dialog.open(PaymentDialogComponent, {
      width: '28.125em',
      data: tour
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const resa: ResaModel = (new ResaModel())
          .setDateResa(moment())
          .setPlaces(result.resa)
          .setTourDate(result.hour);
        const daoResa: DaoResa = new DaoResa(resa, this.tourneeService);
        daoResa.add();

        this.tournees[this.tournees.indexOf(result)].dispo = this.tournees[this.tournees.indexOf(result)].dispo - tour.resa;
        this.tournees[this.tournees.indexOf(result)].resa = 1;

        // Affiche le toast... Material Mode
        this.snackBar.open('Votre réservation a bien été prise en compte.', 'Got it!');

        // TODO Passer la tournée mise à jour à my_component
      }
    });
  }

  private apiCall(tourDate: moment.Moment = null): void {
    this.tourSubscription = this.tourneeService.getRemoteTournees(tourDate).subscribe((tournees) => {
      this.tourDate = this.tourDate ? this.tourDate : moment(tournees[0].date);
      this.currentDisplayTour = moment(tournees[0].date);

      this.tournees = tournees.map((tour) => {
        const date: moment.Moment = moment(tour.date);
        const hour: moment.Moment = moment(tour.time, 'HH:mm:ss');
        date.hour(parseInt(hour.format('H'), 10));
        date.minute(parseInt(hour.format('m'), 10));
        date.second(0);
        const tournee: TourneeInterface = {
          hour: date,
          dispo: 8 - (tour.reservations !== null ? tour.reservations.length : 0),
          resa: 1
        };
        return tournee;
      });
      this.progress = false;
    });
  }
}
