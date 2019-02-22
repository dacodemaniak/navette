import { ResaService } from './../services/resa.service';
import { DaoInterface } from './../interfaces/dao/dao-interface';
import { ResaModel } from './resa-model';
import { TourneesService } from '../services/tournees.service';

export class DaoResa implements DaoInterface<ResaModel> {
  private resas: Array<ResaModel> = new Array<ResaModel>();
  private resaService: ResaService = new ResaService();
  private resa: ResaModel;
  private tourneeService: TourneesService;

  public constructor(resaModel: ResaModel, tourneeService: TourneesService) {
    this.resa = resaModel;
    this.tourneeService = tourneeService;
  }

  public find(id: number): ResaModel {
    const index: number = this.resas.findIndex(
      (obj: ResaModel) => {
        return obj.getId() === id;
      }
    );
    return index !== -1 ? this.resas[index] : null;
  }

  findAll(): void | ResaModel[] {
    return this.resas;
  }

  findBy(property: string, value: any): void | ResaModel[] {
  }

  public add(): ResaModel {
    this.resaService.getAll().then((resas) => {
      resas.push(this.resa);

      this.resaService.persist(resas);
    });

    // Créer l'objet attendu par l'api
    const data: any = {
      nbPlaces: this.resa.getPlaces(),
      owner: 'jla.webprojet@gmail.com', // Bull shit... change for localStorage
      transaction: '0000001', // Bull shit two... get real transaction number
      tournee: {
        date: this.resa.getTourDate().format('YYYY-MM-DD'),
        time: this.resa.getTourDate().format('HH:mm')
      }
    };

    // Appeler la méthode du service
    const observer = this.tourneeService.addReservation(data).subscribe((result) => {
      // NOOP : juste nécessaire pour acheminer la requête
    });
    observer.unsubscribe();

    return this.resa;
  }

  update(): ResaModel {
    this.resas[this.resas.indexOf(this.resa)] = this.resa;

    this.resaService.persist(this.resas);

    return this.resa;
  }
  remove(): ResaModel {
    this.resas.splice(this.resas.indexOf(this.resa), 1);

    return this.resa;
  }


}
