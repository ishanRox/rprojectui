import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { vehical } from '../models/vehical';

@Component({
  selector: 'app-searchbyid',
  templateUrl: './searchbyid.component.html',
  styleUrls: ['./searchbyid.component.css']
})
export class SearchbyidComponent implements OnInit {
  idVal: string = '';

 
  //vehicals array
  allVehicals: vehical[] = [];
  
  constructor( private http: HttpClient, private apollo: Apollo) { }



  ngOnInit(): void {
  }


  
  searchIdFromGraphql(id: string) {
    this.apollo.mutate<any>(
      {
        mutation: gql`mutation{
          getTableById(id:"${id}"){ 
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
        this.allVehicals = [data.getTableById];
      });
  }
}
