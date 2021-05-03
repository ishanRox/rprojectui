import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { SocketClusterClientService } from '../socket-cluster-client.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  private file: File | undefined;
  //offset counter

  constructor(private socketCluster: SocketClusterClientService, private http: HttpClient, private apollo: Apollo) { }


  ngOnInit(): void {
  }

  async submitForm() {
    console.log('upload csv');
    let formData = new FormData();
    formData.append("file", this.file!, this.file!.name!);
    this.http.post("http://localhost:4000/csv/upload", formData).subscribe((response) => {
      console.log(response);
    });
    // const headers = new HttpHeaders().set('Content-Type', 'application/json');

    // this.http.post(`http://localhost:4000/csv/upload`, formData,
    //   {
    //     headers, responseType: 'text',

    //   })
    //   .subscribe((resp: any) => {
    //     console.log(resp);

    //     var blob = new Blob([resp], {
    //       type: "text/plain;charset=utf-8"
    //     });
    //     saveAs(blob, 'test.json');
    //   }, error => console.log(error));

  }

  onFileChange(fileChangeEvent: Event) {
    const target = fileChangeEvent.target as HTMLInputElement;
    const files = target.files as FileList;
    console.log(files[0]);
    this.file = files[0];
  }
}
