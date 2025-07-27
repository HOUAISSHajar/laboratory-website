import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = `${environment.apiUrl}/projects`;

  constructor(private http: HttpClient) { }

  getAllProjects(): Observable<any> {
    // The backend will handle the filtering based on the user's role
    return this.http.get(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error fetching projects:', error);
        return throwError(() => error);
      })
    );
  }

  getProjectById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  createProject(projectData: any): Observable<any> {
    return this.http.post(this.apiUrl, projectData);
  }

  updateProject(id: string, projectData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, projectData);
  }

  deleteProject(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Upload document to project
  uploadDocument(projectId: string, formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/${projectId}/documents`, formData).pipe(
      catchError(error => {
        console.error('Error uploading document:', error);
        return throwError(() => error);
      })
    );
  }

  // Delete document
  deleteDocument(projectId: string, documentId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${projectId}/documents/${documentId}`).pipe(
      catchError(error => {
        console.error('Error deleting document:', error);
        return throwError(() => error);
      })
    );
  }
}