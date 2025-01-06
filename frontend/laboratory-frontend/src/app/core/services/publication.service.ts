import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PublicationService {
  private apiUrl = `${environment.apiUrl}/publications`;

  constructor(private http: HttpClient) { }

  getAllPublications(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getPublicationById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  createPublication(publicationData: any): Observable<any> {
    return this.http.post(this.apiUrl, publicationData);
  }

  updatePublication(id: string, publicationData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, publicationData);
  }

  deletePublication(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  searchPublications(query: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/search?query=${query}`);
  }
}