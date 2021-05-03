import { Injectable } from '@angular/core';
// import { from } from '@apollo/client/core';
// import {socketCluster} from 'socketcluster-client'

@Injectable({
  providedIn: 'root'
})
export class SocketClusterClientService {

  constructor() { }

  connectToSocketCluster(){
   
    // let socket =socketCluster.create({
    //   hostname: 'localhost',
    //   port: 8000
    // });

    // (async () => {

    //   // Subscribe to a channel.
    //   let myChannel = socket.subscribe('myChannel');
    
    //   await myChannel.listener('subscribe').once();
    //   // myChannel.state is now 'subscribed'.
    
    // })();

  }
}
