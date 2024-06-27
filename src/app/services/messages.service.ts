import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Observable, Subject } from 'rxjs';
import environment from '../../environment';
import Message from '../models/message';
import { GetMessagesOfTrialQueryResult } from '../models/results/messages-results';

@Injectable({ providedIn: 'root' })
export class MessagesService {
  private hubConnection: signalR.HubConnection;
  messages$ = new Subject<Message>();

  constructor(private http: HttpClient) {
    this.setHubConnection();
  }

  getMessages(trialId: string) {
    return this.http.get<GetMessagesOfTrialQueryResult>(
      `${environment.apiUrl}/trials/${trialId}/messages`
    );
  }

  sendMessage(id: string, trialId: string, content: string) {
    const payload = { id, trialId, content };
    const url = `${environment.apiUrl}/trials/${trialId}/messages`;
    return this.http.post(url, payload);
  }

  startConnection(): Observable<void> {
    this.setHubConnection();
    return new Observable<void>((observer) => {
      this.hubConnection
        .start()
        .then(() => {
          console.log('Connection established');
          observer.next();
          observer.complete();
        })
        .catch((error) => {
          console.error('Error connecting to messages:', error);
          observer.error(error);
        });
    });
  }

  disconnect(): Promise<void> {
    return this.hubConnection.stop();
  }

  receiveMessage(): Observable<Message> {
    return new Observable<Message>((observer) => {
      this.hubConnection.on('ReceiveMessage', (json: string) => {
        let obj = JSON.parse(json);
        let message = <Message>{
          id: obj.Id,
          author: obj.Author,
          content: obj.Content,
          addedDate: obj.AddedDate,
        };
        this.messages$.next(message);
        observer.next(message);
      });
    });
  }

  private setHubConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.apiUrl}/messageshub`)
      .withAutomaticReconnect()
      .build();
  }
}
