import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Apollo, gql } from 'apollo-angular';
import { getVehicals } from '../state/vehicalstate/vehical.actions';

@Component({
  selector: 'app-update-component',
  templateUrl: './update-component.component.html',
  styleUrls: ['./update-component.component.css']
})
export class UpdateComponentComponent implements OnInit {

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
}

  
  updateRow(fname: string, lname: string, vid: string, email: string) {
    const id = this.idVal;
    console.log(id, fname, lname, vid, email);
    this.apollo.mutate<any>(
      {
        mutation: gql`mutation {
          updateRow(id: "${id}", fname: "${fname}", lname: "${lname}", vid: "${vid}", email: "${email}") {
            ageOfVehicle
            firstName
          }
        }
        
      ` ,
        variables: { id }
      }
    )
      .subscribe(({ data }) => {
        console.log(data);
        alert('update successfull');
        this.searchIdFromGraphql();
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
