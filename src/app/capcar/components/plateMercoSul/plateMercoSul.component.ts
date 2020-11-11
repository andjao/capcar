import {
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';


import {
  NgForm,
} from '@angular/forms';

import $ from "jquery";

import {
  PlatesComponent,
} from '../plates';

@Component({
  selector: 'app-plateMercoSul',
  templateUrl: './platemercoSul.component.html',
  styleUrls: ['./plateMercoSul.component.scss']
})
export class PlateMercoSulComponent implements OnInit {

  @ViewChild("plateMercoSulForm") plateMercoSulForm: NgForm;

  constructor(public platesComponent: PlatesComponent) { }

  mercoSulIFlag = 'assets/images/flags/mercosul.svg';
  initials = 'br';
  countryFlag = `assets/images/flags/${this.initials}.svg`;

  ngOnInit(): void {
  }
  queryPlate(event) {
    if (this.plateMercoSulForm.form.valid) {
      $(event.target).blur();
      this.platesComponent.queryPlate();
    }
  }

}
