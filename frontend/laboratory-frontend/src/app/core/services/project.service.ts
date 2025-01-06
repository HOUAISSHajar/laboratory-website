import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = `${environment.apiUrl}/projects`;

  constructor(private http: HttpClient) { }

  getAllProjects(): Observable<any> {
    return this.http.get(this.apiUrl);
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
}