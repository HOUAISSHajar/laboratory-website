// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-activity-list',
//   standalone: false,
  
//   templateUrl: './activity-list.component.html',
//   styleUrl: './activity-list.component.scss'
// })
// export class ActivityListComponent {

// }
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
  activities: any[] = [];
  isLoading = true;
  canCreateActivity = false;
  userRole: string = '';
  displayedColumns: string[] = ['title', 'type', 'date', 'location', 'status', 'actions'];
  
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
    this.loadActivities();
  }

  loadActivities() {
    this.isLoading = true;
    
    // For faculty_researcher and phd_researcher, load only their activities
    if (['faculty_researcher', 'phd_researcher'].includes(this.userRole)) {
      this.activityService.getUserActivities().subscribe({
        next: (data) => {
          this.activities = data;
          this.isLoading = false;
        },
        error: (error) => {
          this.snackBar.open('Error loading activities', 'Close', { duration: 3000 });
          this.isLoading = false;
        }
      });
    } else {
      // For administrator and associated_member, load all activities
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

  toggleArchive(id: string, isArchived: boolean) {
    this.activityService.toggleArchive(id).subscribe({
      next: () => {
        this.snackBar.open(`Activity ${isArchived ? 'unarchived' : 'archived'} successfully`, 'Close', { duration: 3000 });
        this.loadActivities();
      },
      error: (error) => {
        this.snackBar.open('Error updating activity status', 'Close', { duration: 3000 });
      }
    });
  }
}