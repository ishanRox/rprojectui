import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { of, Subject } from 'rxjs';
import { concatMap, delay } from 'rxjs/operators';
(window as any).global = window;

@Injectable({
  providedIn: 'root'
})
export class SocketClusterClientService {
  socket = require("socketcluster-client").create({
    hostname: "localhost",
    port: 8000,
  });

  subject_test = new Subject();

  constructor(private toastr: ToastrService) { }

  connectToSocketCluster(uidChannel: string) {

    // ... After the socket is created.

    console.log(uidChannel + " unique channel")
    this.socket.transmit("customRemoteEvent", uidChannel);

    (async () => {
      let channel = this.socket.subscribe('customRemoteEvent');
      for await (let data of channel) {
        // ... Handle channel data.
        console.log(data);
      }
    })();

    (async () => {
      let channel = this.socket.subscribe(uidChannel);


      this.subject_test.pipe(
        concatMap(x => of(x)
          .pipe(
            delay(10000))
        )
      ).subscribe(
        (msg) => { console.log(msg); this.showSuccess(msg); },
        (err: any) => console.log(err),
        () => console.log('complete')
      );

      for await (let data of channel) {
        // ... Handle channel data.
        console.log(data + " data received by uidChannel");
        this.subject_test.next(data + " data received by uidChannel");
      }


    })();

  }

  showSuccess(msg: any) {
    console.log(msg);
    this.toastr.info('Hello world!', '' + msg, {
      "positionClass": "toast-top-full-width",
    
    });
  }
}
