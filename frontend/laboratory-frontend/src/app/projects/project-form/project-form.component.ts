import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../core/services/project.service';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-project-form',
  standalone: false,
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.scss'
})
export class ProjectFormComponent implements OnInit {
  projectForm: FormGroup;
  isEditing = false;
  projectId: string | null = null;
  isLoading = false;
  availableUsers: any[] = [];
  currentUserId: string = '';

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.projectForm = this.fb.group({
      title: ['', Validators.required],
      summary: ['', Validators.required],
      members: [[], Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      status: ['ongoing', Validators.required],
      expectedResults: ['']
    });
  }

  ngOnInit() {
    // Get current user ID
    const currentUser = this.authService.getCurrentUser();
    this.currentUserId = currentUser?.id || '';
    
    this.loadUsers();
    this.projectId = this.route.snapshot.paramMap.get('id');
    if (this.projectId) {
      this.isEditing = true;
      this.loadProject(this.projectId);
    }
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        // Filter users: exclude administrators, associated_members, and current user
        this.availableUsers = users.filter((user: any) => 
          ['faculty_researcher', 'phd_researcher'].includes(user.role) && 
          user._id !== this.currentUserId
        );
      },
      error: (error) => {
        console.error('Error loading users:', error);
      }
    });
  }

  loadProject(id: string) {
    this.isLoading = true;
    this.projectService.getProjectById(id).subscribe({
      next: (project) => {
        this.projectForm.patchValue({
          title: project.title,
          summary: project.summary,
          members: project.members.map((member: any) => member._id),
          startDate: project.startDate,
          endDate: project.endDate,
          status: project.status,
          expectedResults: project.expectedResults
        });
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open('Error loading project', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  onSubmit() {
    if (this.projectForm.valid) {
      this.isLoading = true;
      const projectData = this.projectForm.value;

      const request = this.isEditing
        ? this.projectService.updateProject(this.projectId!, projectData)
        : this.projectService.createProject(projectData);

      request.subscribe({
        next: () => {
          this.snackBar.open(
            `Project ${this.isEditing ? 'updated' : 'created'} successfully`,
            'Close',
            { duration: 3000 }
          );
          this.router.navigate(['/projects']);
        },
        error: (error) => {
          this.snackBar.open(
            `Error ${this.isEditing ? 'updating' : 'creating'} project`,
            'Close',
            { duration: 3000 }
          );
          this.isLoading = false;
        }
      });
    }
  }
}