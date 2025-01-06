// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-dashboard',
//   standalone: false,
  
//   templateUrl: './dashboard.component.html',
//   styleUrl: './dashboard.component.scss'
// })
// export class DashboardComponent {

// }
//------------------------------------------------------------------------------------------------------
// import { Component, OnInit } from '@angular/core';
// import { DashboardService } from '../../core/services/dashboard.service';
// import { AuthService } from '../../core/services/auth.service';

// @Component({
//   selector: 'app-dashboard',
//   templateUrl: './dashboard.component.html',
//   styleUrls: ['./dashboard.component.scss']
// })
// export class DashboardComponent implements OnInit {
//   dashboardData: any = {};
//   isLoading = true;
//   userRole: string = '';
//   error: string = '';

//   constructor(
//     private dashboardService: DashboardService,
//     private authService: AuthService
//   ) {}

//   ngOnInit() {
//     const currentUser = this.authService.getCurrentUser();
//     this.userRole = currentUser?.role || '';
//     this.loadDashboardData();
//   }

//   private loadDashboardData() {
//     this.dashboardService.getDashboardData().subscribe({
//       next: (data) => {
//         this.dashboardData = data;
//         this.isLoading = false;
//       },
//       error: (error) => {
//         this.error = 'Failed to load dashboard data';
//         this.isLoading = false;
//       }
//     });
//   }
// }
//-----------------------------------------------------------------------------------------
import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../core/services/dashboard.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-dashboard',
    standalone: false,
    
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
  })
  export class DashboardComponent implements OnInit {
    dashboardData: any = {};
    isLoading = true;
    userRole: string = '';
    error: string = '';
  
    constructor(
      private dashboardService: DashboardService,
      private authService: AuthService
    ) {}
  
    ngOnInit() {
      const currentUser = this.authService.getCurrentUser();
      this.userRole = currentUser?.role || '';
      this.loadDashboardData();
    }
  
    private loadDashboardData() {
      this.dashboardService.getDashboardData().subscribe({
        next: (data) => {
          this.dashboardData = data;
          this.isLoading = false;
        },
        error: (error) => {
          this.error = 'Failed to load dashboard data';
          this.isLoading = false;
        }
      });
    }
  }