import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Apollo, gql } from 'apollo-angular';
import { vehical } from '../models/vehical';
import { getVehicals } from '../state/vehicalstate/vehical.actions';

@Component({
  selector: 'app-searchbyid',
  templateUrl: './searchbyid.component.html',
  styleUrls: ['./searchbyid.component.css']
})
export class SearchbyidComponent implements OnInit {
  idVal: string = '';

 
  //vehicals array
  allVehicals: vehical[] = [];
  
  constructor( private http: HttpClient, private apollo: Apollo,private store: Store<{ getV: { allVehicals: [] }, main: { id: string } }>) { }



  ngOnInit(): void {

    this.store.select('main').subscribe(data => {
      console.log('____________________________________________')
      console.table('main Data');
      console.log(data.id);
      this.idVal = data.id;
      console.log('________________________________________')
    });
  }


 
  
  searchIdFromGraphql() {

    this.apollo.mutate<any>(
      {
        mutation: gql`mutation{
          getTableById(id:"${this.idVal}"){ 
                        id
                        vid
                        firstName
                        lastName
                        email
                        carMake
                        carModel
                        vinNumber
                        manufacturedDate
                        ageOfVehicle
                        
          }
        }
      ` }
    )
      .subscribe(({ data }) => {
        console.log(data);
        // this.allVehicals = [data.getTableById];
        this.store.dispatch(getVehicals({ vehical: [data.getTableById] }));
      });
  }

}
