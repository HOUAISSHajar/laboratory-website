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

  loadDashboardData() {
    this.isLoading = true;
    this.error = '';
    
    this.dashboardService.getDashboardData().subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Dashboard error:', error);
        this.error = 'Failed to load dashboard data. Please try again.';
        this.isLoading = false;
      }
    });
  }

  getCurrentDate(): string {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return today.toLocaleDateString('en-US', options);
  }

  getRoleDisplayName(role: string): string {
    const roleMap: { [key: string]: string } = {
      'administrator': 'Administrator',
      'faculty_researcher': 'Faculty Researcher',
      'phd_researcher': 'PhD Researcher',
      'associated_member': 'Associated Member'
    };
    return roleMap[role] || role;
  }

  getProjectStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'ongoing': 'status-ongoing',
      'completed': 'status-completed',
      'pending': 'status-pending',
      'archived': 'status-archived'
    };
    return statusMap[status] || 'status-default';
  }

  navigateToSection(section: string): void {
    // Cette méthode peut être utilisée pour la navigation future
    console.log('Navigate to:', section);
  }
}