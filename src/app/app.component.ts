import { Component, OnInit } from '@angular/core';
//import { webSocket } from 'rxjs/websocket'
import { SocketService } from './socket.service';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Apollo, gql } from 'apollo-angular';
import { query } from '@angular/animations';
import { vehical } from './models/vehical';
import { io } from 'socket.io-client';
import { webSocket } from 'rxjs/webSocket';
import { of } from 'rxjs';
import { bufferCount, buffer } from 'rxjs/operators'
import { concatMap, delay } from 'rxjs/operators';
import { saveAs } from 'file-saver';
import { SocketClusterClientService } from './socket-cluster-client.service';
import { increment, passId } from './state/counter.actions';
import { Store } from '@ngrx/store';
import { getVehicals } from './state/vehicalstate/vehical.actions';

let offsetCount = 100;



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'rapidui';
  msgInput: string = 'lorem ipsum';
  //file upload

  private file: File | undefined;
  //offset counter

  //vehicals array
  allVehicals: vehical[] = [];

  // socket=io("http://localhost:3000");
  //2 way bind input id
  idVal: string = '';

  socket: any;
  //unique channel for communication
  uidChannel = Date.now().toString(36) + Math.random().toString(36).substr(2);
  constructor(private store: Store<{ getV: { allVehicals: [] } }>, private socketCluster: SocketClusterClientService, private http: HttpClient, private apollo: Apollo) { }

  ngOnInit(): void {

    this.socketCluster.connectToSocketCluster(this.uidChannel);

    // this.setupSocketConnection();

    this.getTotalCount();

    this.getdataFromGraphql();
    this.store.select('getV').subscribe(data => {
      console.log('____________________________________________')
      console.table(data);
      this.allVehicals=data.allVehicals;
      console.log('________________________________________')
    });
  }


  increment() {
    this.store.dispatch(increment());
  }

  exportCsv() {
    console.log('message sended');
    this.apollo.watchQuery<any>(
      {
        query: gql`query{
  
          messages{
            id
            description
          }
        }   
      `

      }
    ).valueChanges
      .subscribe(({ data, loading }) => {
        console.log(data);
      });

  }

  downloadCsv(higher: string, lower: string) {

    this.http.get(`http://localhost:3000/download/?higher=${higher}&lower=${lower}`).subscribe((response) => {
      console.log(response);
    });
    console.log(lower, higher);
  }

  changeOffset(previouseOrNext: string) {
    if (previouseOrNext === 'previouse') {
      if (offsetCount != 100) {
        offsetCount = offsetCount - 100;
        console.log(offsetCount);
        this.getdataFromGraphql();
      }
    } else {
      offsetCount = offsetCount + 100;
      console.log(offsetCount);
      this.getdataFromGraphql();
    }
  }

  getCount() {
    offsetCount = offsetCount + 100;
    console.log(offsetCount);
    this.getdataFromGraphql();
  }

  updateRow(id: string, fname: string, lname: string, vid: string, email: string) {
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
        this.searchIdFromGraphql(id);
      });
  }

  deleteVehicalById(model: string) {
    console.log(model);
    model = model.trim();
    this.apollo.mutate<any>(
      {
        mutation: gql`mutation{
          deleteVehicalById(id:"${model}"  ){
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
        variables: { model }
      }
    )
      .subscribe(({ data }) => {
        console.log(data);
        alert('Delete successfull');
        this.changeOffset('next');
      });

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


  searchIdFromGraphql(model: string) {
    this.apollo.mutate<any>(
      {
        mutation: gql`mutation{
          getTableById(id:"${model}"){ 
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

  getdataFromGraphql() {
    this.apollo.mutate<any>(
      {
        mutation: gql` mutation{
          getTable(first:"100",offsetCount:"${offsetCount}"){ 
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
        //this.allVehicals = data.getTable;
        this.store.dispatch(getVehicals({ vehical: data.getTable }));

      });
  }
  //select id
  selectId(idval: any) {
    console.log(idval);
    this.store.dispatch(passId({ idVal: idval }));
    this.idVal = idval;
  }
  //________________________get the row count
  rowNoArray!: Promise<number[]>;
  getTotalCount() {
    this.apollo.mutate<any>(
      {
        mutation: gql` mutation{
        getTable(first:"10000",offsetCount:"${offsetCount}"){ 
                      id
        }
      }
    ` }
    )
      .subscribe(({ data }) => {
        const rowCount = (Math.floor(Math.ceil(data.getTable.length / 100) * 100 / 100));
        this.rowNoArray = Promise.resolve([...Array(rowCount).keys()].map(e => (e + 1) * 100));
      });
  }
  //custom offset
  getdataFromGraphqlWithOffset(offset: number) {
    offsetCount = offset;

    this.apollo.mutate<any>(
      {
        mutation: gql` mutation{
        getTable(first:"100",offsetCount:"${offset}"){ 
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
        // this.allVehicals = data.getTable;
        this.store.dispatch(getVehicals({ vehical: data.getTable }));
      });
  }
  onFileChange(fileChangeEvent: Event) {
    const target = fileChangeEvent.target as HTMLInputElement;
    const files = target.files as FileList;
    console.log(files[0]);
    this.file = files[0];
  }

  async submitForm() {
    console.log('upload csv');
    let formData = new FormData();
    formData.append("file", this.file!, this.file!.name!);
    this.http.post("http://localhost:4000/csv/upload", formData).subscribe((response) => {
      console.log(response);
    });
  }

}
