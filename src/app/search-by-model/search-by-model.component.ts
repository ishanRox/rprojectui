import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Apollo, gql } from 'apollo-angular';
import { getVehicals } from '../state/vehicalstate/vehical.actions';

@Component({
  selector: 'app-search-by-model',
  templateUrl: './search-by-model.component.html',
  styleUrls: ['./search-by-model.component.css']
})
export class SearchByModelComponent implements OnInit {

  constructor(private store: Store<{ getV: { allVehicals: [] } }>, private apollo: Apollo) { }


  ngOnInit(): void {
  }
  searchModelFromGraphql(model: string) {
    model = model.trim();
    model = model.replace('*', '%');

    this.apollo.mutate<any>(
      {
        mutation: gql`mutation{
          searchModelFromGraphql(model:"${model}"  ){
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
        //this.allVehicals = data.searchModelFromGraphql;
        this.store.dispatch(getVehicals({ vehical: data.searchModelFromGraphql }));
      });
  }
}
