import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { vehical } from '../models/vehical';
import { passId } from '../state/main.actions';

@Component({
  selector: 'app-vehical-component',
  templateUrl: './vehical-component.component.html',
  styleUrls: ['./vehical-component.component.css']
})
export class VehicalComponentComponent implements OnInit {

  //vehicals array
  allVehicals: vehical[] = [];

  //2 way bind input id
  idVal: string = '';
  constructor(private store: Store<{ getV: { allVehicals: [] }, main: { id: string } }>, private apollo: Apollo) { }

  ngOnInit(): void {
    this.store.select('main').subscribe(data => {
      console.log('____________________________________________')
      console.table('main Data');
      console.log(data.id);
      this.idVal = data.id;
      console.log('________________________________________')
    });

    this.store.select('getV').subscribe(data => {
      console.log('____________________________________________')
      console.table('vehical Data');
      this.allVehicals = data.allVehicals;
      console.log('________________________________________')
    });
  }

  //select id
  selectId(idval: any) {
    console.log(idval);
    this.store.dispatch(passId({ idVal: idval }));
    // this.idVal = idval;
  }
}
