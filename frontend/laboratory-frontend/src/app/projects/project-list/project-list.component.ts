// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-project-list',
//   standalone: false,
  
//   templateUrl: './project-list.component.html',
//   styleUrl: './project-list.component.scss'
// })
// export class ProjectListComponent {

// }
//------------------------------------------------------------------------------------------
// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { ProjectService } from '../../core/services/project.service';
// import { AuthService } from '../../core/services/auth.service';
// import { MatSnackBar } from '@angular/material/snack-bar';

// @Component({
//   selector: 'app-project-list',
//   templateUrl: './project-list.component.html',
//   styleUrls: ['./project-list.component.scss']
// })
// export class ProjectListComponent implements OnInit {
//   projects: any[] = [];
//   isLoading = true;
//   canCreateProject = false;
//   displayedColumns: string[] = ['title', 'status', 'startDate', 'members', 'actions'];

//   constructor(
//     private projectService: ProjectService,
//     private authService: AuthService,
//     private router: Router,
//     private snackBar: MatSnackBar
//   ) {}

//   ngOnInit() {
//     const userRole = this.authService.getCurrentUser()?.role;
//     this.canCreateProject = ['administrator', 'faculty_researcher'].includes(userRole || '');
//     this.loadProjects();
//   }

//   loadProjects() {
//     this.projectService.getAllProjects().subscribe({
//       next: (data) => {
//         this.projects = data;
//         this.isLoading = false;
//       },
//       error: (error) => {
//         this.snackBar.open('Error loading projects', 'Close', { duration: 3000 });
//         this.isLoading = false;
//       }
//     });
//   }

//   createNew() {
//     this.router.navigate(['/projects/new']);
//   }

//   viewProject(id: string) {
//     this.router.navigate(['/projects', id]);
//   }

//   editProject(id: string) {
//     this.router.navigate(['/projects/edit', id]);
//   }

//   deleteProject(id: string) {
//     if (confirm('Are you sure you want to delete this project?')) {
//       this.projectService.deleteProject(id).subscribe({
//         next: () => {
//           this.snackBar.open('Project deleted successfully', 'Close', { duration: 3000 });
//           this.loadProjects();
//         },
//         error: (error) => {
//           this.snackBar.open('Error deleting project', 'Close', { duration: 3000 });
//         }
//       });
//     }
//   }
// }
//--------------------------------------------------------------------------------------
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
}