import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket: Socket;

  constructor() {
    
      this.socket = io('http//localhost:3000/');

   
  }

  // EMITTER
  sendMessage(msg: string) {
    this.socket.emit('sendMessage', { message: msg });
  }

  // HANDLER
  onNewMessage() {
    return new Observable(observer => {
      this.socket.on('newMessage', msg => {
        observer.next(msg);
      });
    });
  }
}
