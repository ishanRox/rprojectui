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
import {saveAs} from 'file-saver';
let offsetCount = 10;

const subject = webSocket({
  url: "ws://localhost:8080",
  deserializer: (events) => {
    // if (events.data && events.data.activities) {
    //   console.log('your dad is here');
    // }
    console.log('HEREO')
    return events
  }
});

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


  constructor(private http: HttpClient, private apollo: Apollo) { }

  ngOnInit(): void {
    this.getdataFromGraphql();

    subject.pipe(
      concatMap(x => of(x)
        .pipe(
          delay(10000))
      )
    ).subscribe(
      (msg) => { console.log(msg); alert(msg.data); },
      (err) => console.log(err),
      () => console.log('complete')
    );

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
        // this.allVehicals = data.allVehicals.nodes;
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
      if (offsetCount != 10) {
        offsetCount = offsetCount - 10;
        console.log(offsetCount);
        this.getdataFromGraphql();
      }
    } else {
      offsetCount = offsetCount + 10;
      console.log(offsetCount);
      this.getdataFromGraphql();
    }
  }

  updateRow(id: string, fname: string, lname: string, vid: string, email: string) {
    console.log(id, fname, lname, vid, email);
    this.apollo.mutate<any>(
      {
        mutation: gql`mutation {
          updateVehicalById(
            input: {id: "${id}", vehicalPatch: {firstName: "${fname}", lastName: "${lname}", email: "${email}", vid: "${vid}"}}
          ) {
            vehical {
              id
              firstName
              lastName
              email
              carMake
            }
          }
        }
      `
        ,
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
        mutation: gql` mutation {
          deleteVehicalById(input: { id: "${model.trim()}" }) {
            vehical{
              vinNumber
            }
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

    this.apollo.watchQuery<any>(
      {
        query: gql`query($model:String){
          allVehicals(
           filter: {
            carModel: { like:$model }
          }
        ) {
            nodes {
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
        }        
      `
        ,
        variables: { model }
      }
    ).valueChanges
      .subscribe(({ data, loading }) => {
        console.log(data.allVehicals.nodes);
        this.allVehicals = data.allVehicals.nodes;
      });
  }

  searchIdFromGraphql(model: string) {
    // mutation{
    //   getTable(first:"3",offsetCount:"2"){ 
    //                 id
    //                 vid
    //                 firstName
    //                 lastName
    //                 email
    //                 carMake
    //                 carModel
    //                 vinNumber
    //                 manufacturedDate
    //                 ageOfVehicle
    //   }
    // }

    this.apollo.watchQuery<any>(
      {
        query: gql`{
          vehicalById(id: "${model}") {
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
    ).valueChanges
      .subscribe(({ data, loading }) => {
        console.log(data);
        this.allVehicals = [data.vehicalById];
      });
  }

  getdataFromGraphql() {

    // mutation{
    //   getTable(first:"3",offsetCount:"2"){ 
    //                 id
    //                 vid
    //                 firstName
    //                 lastName
    //                 email
    //                 carMake
    //                 carModel
    //                 vinNumber
    //                 manufacturedDate
    //                 ageOfVehicle
    //   }
    // }

    this.apollo.watchQuery<any>(
      {
        query: gql`{
        allVehicals( first:100 offset:${offsetCount}  orderBy :MANUFACTURED_DATE_ASC) {
          nodes {
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
      }
      ` }
    ).valueChanges
      .subscribe(({ data, loading }) => {
        console.log(data.allVehicals.nodes);
        this.allVehicals = data.allVehicals.nodes;
      });
  }

  onFileChange(fileChangeEvent: Event) {
    const target = fileChangeEvent.target as HTMLInputElement;
    const files = target.files as FileList;
    console.log(files[0]);
    this.file = files[0];
  }

  async submitForm() {
    let formData = new FormData();
    formData.append("file", this.file!, this.file!.name!);

    // this.http.post("http://localhost:4000/csv/upload", formData).subscribe((response) => {
    //   console.log(response);
    // });
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    this.http.post(`"http://localhost:4000/csv/upload"`,formData,
     {headers,responseType: 'text',
    
    })
    .subscribe((resp: any) => {
      console.log(resp);
      // let blob:any = new Blob([resp], { type: 'text/json; charset=utf-8' });
			// const url = window.URL.createObjectURL(blob);
			// window.open(url);
			// //window.location.href = response.url;
      var blob = new Blob([resp], {
        type: "text/plain;charset=utf-8"
      });
			saveAs(blob, 'test.json');
    },error=>console.log(error));

  }

}
