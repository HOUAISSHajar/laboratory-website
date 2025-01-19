
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private apiUrl = `${environment.apiUrl}/messages`;

  constructor(private http: HttpClient) { }

  sendMessage(message: any): Observable<any> {
    return this.http.post(this.apiUrl, message);
  }

  getInboxMessages(): Observable<any> {
    return this.http.get(`${this.apiUrl}/inbox`);
  }

  getSentMessages(): Observable<any> {
    return this.http.get(`${this.apiUrl}/sent`);
  }

  markAsRead(messageId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${messageId}/read`, {});
  }
}