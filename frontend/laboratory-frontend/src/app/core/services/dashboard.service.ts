// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class DashboardService {

//   constructor() { }
// }
//--------------------------------------------------------------------------------------------------
// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { environment } from '../../../environments/environment';

// @Injectable({
//   providedIn: 'root'
// })
// export class DashboardService {
//   private apiUrl = `${environment.apiUrl}/dashboard`;

//   constructor(private http: HttpClient) { }

//   getDashboardData(): Observable<any> {
//     return this.http.get(`${this.apiUrl}`);
//   }

//   getUserActivity(): Observable<any> {
//     return this.http.get(`${this.apiUrl}/activity`);
//   }
// }
//-----------------------------------------------------------------------------------------------
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = `${environment.apiUrl}/dashboard`;

  constructor(private http: HttpClient) { }

  getDashboardData(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  getUserActivity(): Observable<any> {
    return this.http.get(`${this.apiUrl}/activity`);
  }
}