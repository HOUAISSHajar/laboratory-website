import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PublicationService {
  private apiUrl = `${environment.apiUrl}/publications`;

  constructor(private http: HttpClient) { }

  getAllPublications(): Observable<any> {
    // The backend will handle the filtering based on the user's role
    return this.http.get(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error fetching publications:', error);
        return throwError(() => error);
      })
    );
  }

  getPublicationById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error fetching publication:', error);
        return throwError(() => error);
      })
    );
  }

  createPublication(publicationData: any): Observable<any> {
    return this.http.post(this.apiUrl, publicationData).pipe(
      catchError(error => {
        console.error('Error creating publication:', error);
        return throwError(() => error);
      })
    );
  }

  updatePublication(id: string, publicationData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, publicationData).pipe(
      catchError(error => {
        console.error('Error updating publication:', error);
        return throwError(() => error);
      })
    );
  }

  deletePublication(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error deleting publication:', error);
        return throwError(() => error);
      })
    );
  }

  searchPublications(query: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/search?query=${encodeURIComponent(query)}`).pipe(
      catchError(error => {
        console.error('Error searching publications:', error);
        return throwError(() => error);
      })
    );
  }

  getUserPublications(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user`).pipe(
      catchError(error => {
        console.error('Error fetching user publications:', error);
        return throwError(() => error);
      })
    );
  }
}