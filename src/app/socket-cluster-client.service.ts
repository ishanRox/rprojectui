import { Injectable } from '@angular/core';
(window as any).global = window;

//  var socketClusterClient = require("socketcluster-client");

@Injectable({
  providedIn: 'root'
})
export class SocketClusterClientService {
   socket = require("socketcluster-client").create({
    hostname: "localhost",
    port: 8000,
  });
  

  constructor() { }

  connectToSocketCluster() {
   
    // ... After the socket is created.
    const uidChannel=Date.now().toString(36) + Math.random().toString(36).substr(2);
    
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
        for await (let data of channel) {
          // ... Handle channel data.
          console.log(data+" data received by uidChannel genius");
        }
      })();

  }
}
