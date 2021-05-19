import { Component, OnInit } from '@angular/core';
//import { webSocket } from 'rxjs/websocket';
import { HttpClient } from "@angular/common/http";
import { Apollo, gql } from 'apollo-angular';
import { vehical } from './models/vehical';
import { SocketClusterClientService } from './socket-cluster-client.service';
import { increment, passId } from './state/main.actions';
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

  //2 way bind input id
  idVal: string = '';

  socket: any;
  //unique channel for communication
  uidChannel = Date.now().toString(36) + Math.random().toString(36).substr(2);
  constructor(private store: Store<{ getV: { allVehicals: [] }, main: { id: string } }>, private socketCluster: SocketClusterClientService, private http: HttpClient, private apollo: Apollo) { }

  ngOnInit(): void {

    this.socketCluster.connectToSocketCluster(this.uidChannel);

    this.getTotalCount();

    this.getdataFromGraphql();

    this.store.select('getV').subscribe(data => {
      console.log('____________________________________________')
      console.table('vehical Data');
      this.allVehicals = data.allVehicals;
      console.log('________________________________________')
    });

    this.store.select('main').subscribe(data => {
      console.log('____________________________________________')
      console.table('main Data');
      console.log(data.id);
      this.idVal = data.id;
      console.log('________________________________________')
    });

  }

  increment() {
    this.store.dispatch(increment());
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
