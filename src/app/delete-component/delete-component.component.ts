import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Apollo, gql } from 'apollo-angular';
import { passId } from '../state/main.actions';

@Component({
  selector: 'app-delete-component',
  templateUrl: './delete-component.component.html',
  styleUrls: ['./delete-component.component.css']
})
export class DeleteComponentComponent implements OnInit {
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

  
  deleteVehicalById() {
    //to acces in inner object 
     const id=this.idVal; 
     this.apollo.mutate<any>(
       {
         mutation: gql`mutation{
           deleteVehicalById(id:"${id}"  ){
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
       `
         ,
         variables: { id }
       }
     )
       .subscribe(({ data }) => {
         console.log(data);
         alert('Delete successfull');
         this.store.dispatch(passId({ idVal: "" }));
        // this.changeOffset('next');
       });
 
   }
}
