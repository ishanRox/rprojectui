import { Component, OnInit } from '@angular/core';
//import { webSocket } from 'rxjs/websocket'
import { SocketService } from './socket.service';
import { HttpClient } from "@angular/common/http";
import { Apollo, gql } from 'apollo-angular';
import { query } from '@angular/animations';
import { vehical } from './models/vehical';

let offsetCount = 10;


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

  constructor(private http: HttpClient, private apollo: Apollo) { }

  ngOnInit(): void {
    console.log('started');
    this.getdataFromGraphql();
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

  updateRow(id:string,fname:string,lname:string,vid:string,email:string){
    console.log(id,fname,lname,vid,email);
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
    model=model.trim();
    console.log(model);
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
    this.apollo.watchQuery<any>(
      {
        query: gql`{
        allVehicals( first:100 offset:${offsetCount} orderBy:AGE_OF_VEHICLE_ASC) {
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

    this.http.post("http://localhost:4000/photos/upload", formData).subscribe((response) => {
      console.log(response);
    });
  }



  // sendButtonClick() {
  //   try {
  //     console.log('connected ccccc');
  //     this.chatService.sendMessage(this.msgInput);
  //   } catch (error) {
  //     console.log(error);
  //   }

  // }

  // subject = webSocket('ws://localhost:3000/')
  exportCsv() {
    // this.sendButtonClick();
    // console.log('sdfsfsdfdsfdsf');
    // try {
    //   console.log('dsfdsf');
    //   console.log(this.subject);
    //   this.subject.subscribe();
    //   this.subject.next('ishaaaan');
    //   this.subject.complete();

    // } catch (error) {
    //   console.log(error);
    // }
    // alert('fuck');
  }

}
