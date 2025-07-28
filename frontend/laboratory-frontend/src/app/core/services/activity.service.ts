import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private apiUrl = `${environment.apiUrl}/activities`;

  constructor(private http: HttpClient) { }

  getAllActivities(): Observable<any> {
    return this.http.get(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error fetching activities:', error);
        return throwError(() => error);
      })
    );
  }

  getActivityById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error fetching activity:', error);
        return throwError(() => error);
      })
    );
  }

  createActivity(activityData: any): Observable<any> {
    return this.http.post(this.apiUrl, activityData).pipe(
      catchError(error => {
        console.error('Error creating activity:', error);
        return throwError(() => error);
      })
    );
  }

  updateActivity(id: string, activityData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, activityData).pipe(
      catchError(error => {
        console.error('Error updating activity:', error);
        return throwError(() => error);
      })
    );
  }

  toggleArchiveStatus(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/toggle-archive`, {}).pipe(
      catchError(error => {
        console.error('Error toggling archive status:', error);
        return throwError(() => error);
      })
    );
  }

  deleteActivity(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error deleting activity:', error);
        return throwError(() => error);
      })
    );
  }

  getUserActivities(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user`).pipe(
      catchError(error => {
        console.error('Error fetching user activities:', error);
        return throwError(() => error);
      })
    );
  }
}