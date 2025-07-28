import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivityService } from '../../core/services/activity.service';
import { AuthService } from '../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-activity-list',
  standalone: false,
  templateUrl: './activity-list.component.html',
  styleUrl: './activity-list.component.scss'
})
export class ActivityListComponent implements OnInit {
  userRole: string = '';
  activities: any[] = [];
  isLoading = true;
  canCreateActivity = false;
  displayedColumns: string[] = ['title', 'type', 'date', 'location', 'organizers', 'status', 'actions'];
  pageTitle: string = '';
  
  constructor(
    private activityService: ActivityService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    const currentUser = this.authService.getCurrentUser();
    this.userRole = currentUser?.role || '';
    this.canCreateActivity = ['administrator', 'faculty_researcher', 'phd_researcher'].includes(this.userRole);
    
    // Set title based on role
    if (['faculty_researcher', 'phd_researcher'].includes(this.userRole)) {
      this.pageTitle = 'My Activities';
    } else {
      this.pageTitle = 'All Activities';
    }
    
    this.loadActivities();
  }

  loadActivities() {
    this.activityService.getAllActivities().subscribe({
      next: (data) => {
        this.activities = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open('Error loading activities', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  createNew() {
    this.router.navigate(['/activities/new']);
  }

  viewActivity(id: string) {
    this.router.navigate(['/activities', id]);
  }

  editActivity(id: string) {
    this.router.navigate(['/activities/edit', id]);
  }

  toggleArchiveStatus(id: string) {
    this.activityService.toggleArchiveStatus(id).subscribe({
      next: (updatedActivity) => {
        const statusText = updatedActivity.isArchived ? 'archived' : 'unarchived';
        this.snackBar.open(`Activity ${statusText} successfully`, 'Close', { duration: 3000 });
        this.loadActivities();
      },
      error: (error) => {
        this.snackBar.open('Error updating activity status', 'Close', { duration: 3000 });
      }
    });
  }

  deleteActivity(id: string) {
    if (confirm('Are you sure you want to delete this activity?')) {
      this.activityService.deleteActivity(id).subscribe({
        next: () => {
          this.snackBar.open('Activity deleted successfully', 'Close', { duration: 3000 });
          this.loadActivities();
        },
        error: (error) => {
          this.snackBar.open('Error deleting activity', 'Close', { duration: 3000 });
        }
      });
    }
  }

  getTypeDisplayName(type: string): string {
    const typeMap: { [key: string]: string } = {
      'conference': 'Conference',
      'seminar': 'Seminar',
      'workshop': 'Workshop',
      'training': 'Training',
      'research_mission': 'Research Mission'
    };
    return typeMap[type] || type;
  }

  getStatusDisplayName(isArchived: boolean): string {
    return isArchived ? 'Archived' : 'Active';
  }

  getStatusColor(isArchived: boolean): string {
    return isArchived ? 'warn' : 'primary';
  }

  // New methods for modern features
  getTypeCount(type: string): number {
    return this.activities.filter(activity => activity.type === type).length;
  }

  getActiveCount(): number {
    return this.activities.filter(activity => !activity.isArchived).length;
  }

  // Filter and search methods (to be implemented later)
  openFilterDialog() {
    console.log('Opening filter dialog...');
  }

  openSearchDialog() {
    console.log('Opening search dialog...');
  }
}