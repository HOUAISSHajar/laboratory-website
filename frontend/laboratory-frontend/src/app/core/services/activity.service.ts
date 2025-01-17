import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private apiUrl = `${environment.apiUrl}/activities`;

  constructor(private http: HttpClient) { }

  getAllActivities(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getActivityById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  createActivity(activityData: any): Observable<any> {
    return this.http.post(this.apiUrl, activityData);
  }

  updateActivity(id: string, activityData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, activityData);
  }

  deleteActivity(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  toggleArchive(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/archive`, {});
  }

  getUserActivities(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user`);
  }

}