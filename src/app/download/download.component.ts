import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.css']
})
export class DownloadComponent implements OnInit {
  @Input() uidChannel: string = "";

  constructor(private http: HttpClient) { }

  ngOnInit(): void { }

  downloadCsv(higher: string, lower: string) {
    this.http.get(`http://localhost:3000/download/?higher=${higher}&lower=${lower}&uidChannel=${this.uidChannel}`).subscribe((response) => {
      // console.log(response);
    });
    console.log(lower, higher);
  }
}
