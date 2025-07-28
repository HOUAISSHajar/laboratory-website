import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../../core/services/project.service';
import { AuthService } from '../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-project-list',
  standalone: false,
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.scss'
})
export class ProjectListComponent implements OnInit {
  userRole: string = '';
  projects: any[] = [];
  isLoading = true;
  canCreateProject = false;
  displayedColumns: string[] = ['title', 'status', 'startDate', 'members', 'actions'];
  pageTitle: string = '';
  
  constructor(
    private projectService: ProjectService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    const currentUser = this.authService.getCurrentUser();
    this.userRole = currentUser?.role || '';
    this.canCreateProject = ['administrator', 'faculty_researcher', 'phd_researcher'].includes(this.userRole);
    
    // Set title based on role
    if (['faculty_researcher', 'phd_researcher'].includes(this.userRole)) {
      this.pageTitle = 'My Projects';
    } else {
      this.pageTitle = 'All Projects';
    }
    
    this.loadProjects();
  }

  loadProjects() {
    this.projectService.getAllProjects().subscribe({
      next: (data) => {
        this.projects = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open('Error loading projects', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  createNew() {
    this.router.navigate(['/projects/new']);
  }

  viewProject(id: string) {
    this.router.navigate(['/projects', id]);
  }

  editProject(id: string) {
    this.router.navigate(['/projects/edit', id]);
  }

  deleteProject(id: string) {
    if (confirm('Are you sure you want to delete this project?')) {
      this.projectService.deleteProject(id).subscribe({
        next: () => {
          this.snackBar.open('Project deleted successfully', 'Close', { duration: 3000 });
          this.loadProjects();
        },
        error: (error) => {
          this.snackBar.open('Error deleting project', 'Close', { duration: 3000 });
        }
      });
    }
  }

  // New methods for modern features
  getStatusCount(status: string): number {
    return this.projects.filter(project => project.status === status).length;
  }

  getStatusDisplayName(status: string): string {
    const statusMap: { [key: string]: string } = {
      'ongoing': 'Ongoing',
      'completed': 'Completed',
      'pending': 'Pending'
    };
    return statusMap[status] || status;
  }

  getProjectProgress(project: any): number {
    // Calculate progress based on project status and timeline
    const now = new Date();
    const startDate = new Date(project.startDate);
    const endDate = new Date(project.endDate);

    if (project.status === 'completed') {
      return 100;
    }

    if (project.status === 'pending' || now < startDate) {
      return 0;
    }

    if (now > endDate) {
      return project.status === 'ongoing' ? 90 : 100;
    }

    // Calculate based on time elapsed
    const totalDuration = endDate.getTime() - startDate.getTime();
    const elapsed = now.getTime() - startDate.getTime();
    const progress = Math.round((elapsed / totalDuration) * 100);

    return Math.min(Math.max(progress, 0), 95); // Cap at 95% if ongoing
  }

  // Get member initials for avatar display
  getMemberInitials(member: any): string {
    return `${member.firstName.charAt(0)}${member.lastName.charAt(0)}`;
  }

  // Format date for display
  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  // Get days remaining for project
  getDaysRemaining(endDate: string): number {
    const now = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Check if project is overdue
  isProjectOverdue(project: any): boolean {
    const now = new Date();
    const endDate = new Date(project.endDate);
    return now > endDate && project.status !== 'completed';
  }

  // Get project duration in days
  getProjectDuration(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}