import {
  Component,
  OnInit,
} from '@angular/core';

import {
  Plate,
} from '../..';

import {
  RequestsService,
  LoadingService,
  LocalStorageService,
  SharedService,
} from '../../services';

import {
  FipeValueComponent,
} from '../fipeValue';

@Component({
  selector: 'app-plate',
  templateUrl: './plates.component.html',
  styleUrls: ['./plates.component.scss']
})
export class PlatesComponent implements OnInit {

  constructor(
    private requestsService: RequestsService,
    private loadingService: LoadingService,
    private localStorageService: LocalStorageService,
    public fipeValueComponent: FipeValueComponent,
    public sharedService: SharedService,
  ) {
    this.sharedService.stateCountyRes = 'BRASIL';
  }

  ngOnInit(): void {
    this.init();
  }

  init(): void {
    if (!JSON.parse(this.localStorageService.loadLocalStorage('history'))) {
      this.sharedService.selectedType = "carros";
    } else {
      this.sharedService.selectedType = JSON.parse(this.localStorageService.loadLocalStorage('history'))[0].tipo;
      this.sharedService.mercoSul = JSON.parse(this.localStorageService.loadLocalStorage('history'))[0].mercosul;
    }
  }

  queryPlate(): void {
    let plate = this.sharedService.mercoSul
      ? this.sharedService.plateMercoSul
      : this.sharedService.plateNational.split("-").join("");
    this.loadingService.loadingM(true, '.8', 'Consultando...');
    this.requestsService
      .plateRequest(plate.toUpperCase())
      .subscribe(
        response => {
          this.loadingService.loadingM(false);
          if (response.codigoRetorno == "404") {
            this.sharedService.queryOK = false;
            return;
          } else {
            this.sharedService.stateCountyRes = `${response.uf} - ${response.municipio}`;
            this.sharedService.plateResponse = response;
            this.clearWords(response);
            this.sharedService.queryOK = true;
            this.checkType(this.sharedService.selectedType);
            this.localStorageService.saveLocalStorage('history', response, {
              type: this.sharedService.selectedType,
              mercosul: this.sharedService.mercoSul
            });
            this.fipeValueComponent.fipeBrands(this.sharedService.selectedType)
          }
        },
        error => {
          this.sharedService.queryOK = false;
          this.loadingService.loadingM(false);
          if (!navigator.onLine) return alert("Você provavelmente não esta conectado a internet");
          if (error.response == undefined) alert("Você ultrapassou o numero de consultas que pode ser feita por minuto. Por favor aguarde um pouco em tente novamente em instantes.");
        }
      );
  }

  clearWords(response): void {
    if (!this.sharedService.mercoSul) this.sharedService.plateResponse.placa = response.placa.match(/[a-zA-Z]+|[0-9]+/g).join("-");
    if (response.marca.indexOf('/') > -1 || response.modelo.indexOf('/') > -1) {
      this.sharedService.plateResponse.marca = response.marca.split('/')[0];
      this.sharedService.plateResponse.modelo = response.modelo.split('/')[1];
    }

    const brand = this.sharedService.plateResponse.marca.toUpperCase();

    switch (true) {
      case brand.indexOf('AMGC') != -1:
        this.sharedService.plateResponse.marca = 'Am Gem';
        break;
      case brand.indexOf('CHEV') != -1:
        this.sharedService.plateResponse.marca = 'Chevrolet';
        break;
      case brand.indexOf('IMP') != -1:
        this.sharedService.plateResponse.marca = 'GM';
        break;
      case brand.indexOf('JAG') != -1:
        this.sharedService.plateResponse.marca = 'Jaguar';
        break;
      case brand.indexOf('LROVER') != -1:
      case brand.indexOf('LR') != -1:
        this.sharedService.plateResponse.marca = 'Land Rover';
        break;
      case brand.indexOf('MPOLO') != -1:
        this.sharedService.plateResponse.marca = 'Marcopolo';
        break;
      case brand.indexOf('BRAMONT') != -1:
        this.sharedService.plateResponse.marca = 'Mahindra';
        break;
      case brand.indexOf('MB') != -1:
      case brand.indexOf('MBENZ') != -1:
      case brand.indexOf('M.BENZ') != -1:
      case brand.indexOf('M.BEMZ') != -1:
      case brand.indexOf('MERCEDES BENZ') != -1:
      case brand.indexOf('MERCEDES') != -1:
        this.sharedService.plateResponse.marca = 'Mercedes-Benz';
        break;
      case brand.indexOf('MMC') != -1:
        this.sharedService.plateResponse.marca = 'Mitsubishi';
        break;
      case brand.indexOf('INTERNATIONAL') != -1:
        this.sharedService.plateResponse.marca = 'Navistar';
        break;
      case brand.indexOf('AMV') != -1:
      case brand.indexOf('PUMA') != -1:
        this.sharedService.plateResponse.marca = 'Puma-Alfa';
        break;
      case brand.indexOf('VW') != -1:
        this.sharedService.plateResponse.marca = 'Volkswagen';
        break;
    }

    const model = this.sharedService.plateResponse.modelo.toUpperCase();
    switch (true) {
      case (model.indexOf('chevrolet'.toUpperCase()) != -1):
        this.sharedService.plateResponse.modelo = model.split('chevrolet '.toUpperCase())[1];
        break;
      case (model.indexOf('gm'.toUpperCase()) != -1):
        this.sharedService.plateResponse.modelo = model.split('gm '.toUpperCase())[1];
        break;
    }
  }

  checkType(type): void {
    let vehicleType: string;
    switch (type) {
      case 'carros':
        vehicleType = 'Carro';
        break;
      case 'motos':
        vehicleType = "Moto";
        break;
      case 'caminhoes':
        vehicleType = "Caminhão";
        break;
    }
    this.sharedService.vehicleType = vehicleType;
  }

  history() {
    this.sharedService.historyOpen = true;
    this.sharedService.history = JSON.parse(this.localStorageService.loadLocalStorage('history'));
  }

}
