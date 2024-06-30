import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Observable, Subject } from 'rxjs';
import environment from '../../environment';
import Message from '../models/message';
import { GetMessagesOfTrialQueryResult } from '../models/results/messages-results';

@Injectable({ providedIn: 'root' })
export class MessageService {
  private hubConnection: signalR.HubConnection;
  private isConnected = false;
  connected$ = new Subject<boolean>();
  messages$ = new Subject<Message>();
  trialChats: string[] = [];

  constructor(private http: HttpClient) {}

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

  async joinTrialChat(trialId: string): Promise<void> {
    if (this.trialChats.includes(trialId))
      return new Promise<void>((resolve) => resolve());
    this.trialChats.push(trialId);
    return this.hubConnection.invoke('JoinTrialChat', trialId);
  }

  startConnection(token: string): Observable<void> {
    if (this.isConnected) {
      return new Observable<void>((observer) => {
        observer.next();
        observer.complete();
      });
    }

    this.trialChats = [];
    this.hubConnection = this.createConnection(token);

    return new Observable<void>((observer) => {
      this.hubConnection
        .start()
        .then(() => {
          this.receiveMessage();
          this.isConnected = true;
          this.connected$.next(true);
          observer.next();
          observer.complete();
        })
        .catch((error) => observer.error(error));
    });
  }

  disconnect(): Promise<void> {
    this.trialChats = [];
    return this.hubConnection.stop();
  }

  private receiveMessage() {
    this.hubConnection.on('ReceiveMessage', (json: string) => {
      let obj = JSON.parse(json);
      let message = <Message>{
        id: obj.Id,
        trialId: obj.TrialId,
        addedById: obj.AddedById,
        author: obj.Author,
        content: obj.Content,
        addedDate: obj.AddedDate,
      };
      this.messages$.next(message);
    });
  }

  private createConnection(token: string): signalR.HubConnection {
    return new signalR.HubConnectionBuilder()
      .withUrl(`${environment.apiUrl}/messageshub`, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();
  }
}
