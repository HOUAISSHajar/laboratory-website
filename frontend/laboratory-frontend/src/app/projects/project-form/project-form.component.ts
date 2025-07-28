import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
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
  isSubmitting = false;
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
      title: ['', [Validators.required, Validators.minLength(3)]],
      summary: ['', [Validators.required, Validators.minLength(10)]],
      members: [[], Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      status: ['pending', Validators.required],
      expectedResults: ['']
    }, { validators: this.dateRangeValidator });
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

  // Custom validator for date range
  dateRangeValidator(control: AbstractControl): {[key: string]: any} | null {
    const startDate = control.get('startDate')?.value;
    const endDate = control.get('endDate')?.value;
    
    if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
      return { 'dateRange': true };
    }
    return null;
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
        this.snackBar.open('Error loading users', 'Close', { duration: 3000 });
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
          startDate: new Date(project.startDate),
          endDate: new Date(project.endDate),
          status: project.status,
          expectedResults: project.expectedResults || ''
        });
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open('Error loading project', 'Close', { duration: 3000 });
        this.isLoading = false;
        this.router.navigate(['/projects']);
      }
    });
  }

  onSubmit() {
    if (this.projectForm.valid) {
      this.isSubmitting = true;
      const projectData = this.projectForm.value;

      // Format dates properly
      projectData.startDate = new Date(projectData.startDate).toISOString();
      projectData.endDate = new Date(projectData.endDate).toISOString();

      const request = this.isEditing
        ? this.projectService.updateProject(this.projectId!, projectData)
        : this.projectService.createProject(projectData);

      request.subscribe({
        next: (response) => {
          const action = this.isEditing ? 'updated' : 'created';
          this.snackBar.open(
            `Project ${action} successfully`,
            'Close',
            { duration: 3000 }
          );
          this.router.navigate(['/projects']);
        },
        error: (error) => {
          const action = this.isEditing ? 'updating' : 'creating';
          this.snackBar.open(
            `Error ${action} project`,
            'Close',
            { duration: 3000 }
          );
          this.isSubmitting = false;
        }
      });
    } else {
      this.markFormGroupTouched();
      this.snackBar.open('Please correct the errors in the form', 'Close', { duration: 3000 });
    }
  }

  // Helper method to mark all fields as touched to show validation errors
  private markFormGroupTouched() {
    Object.keys(this.projectForm.controls).forEach(key => {
      const control = this.projectForm.get(key);
      control?.markAsTouched();
    });
  }

  // Get display name for user roles
  getRoleDisplayName(role: string): string {
    const roleMap: { [key: string]: string } = {
      'faculty_researcher': 'Faculty Researcher',
      'phd_researcher': 'PhD Researcher',
      'administrator': 'Administrator',
      'associated_member': 'Associated Member'
    };
    return roleMap[role] || role;
  }

  // Get display name for status
  getStatusDisplayName(status: string): string {
    const statusMap: { [key: string]: string } = {
      'ongoing': 'Ongoing',
      'completed': 'Completed',
      'pending': 'Pending'
    };
    return statusMap[status] || status;
  }

  // Format date range for preview
  formatDateRange(): string {
    const startDate = this.projectForm.get('startDate')?.value;
    const endDate = this.projectForm.get('endDate')?.value;
    
    if (!startDate || !endDate) return 'No dates selected';
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    
    return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
  }

  // Get count of selected members
  getSelectedMembersCount(): number {
    const members = this.projectForm.get('members')?.value;
    return Array.isArray(members) ? members.length : 0;
  }

  // Calculate project duration in days
  getProjectDuration(): number {
    const startDate = this.projectForm.get('startDate')?.value;
    const endDate = this.projectForm.get('endDate')?.value;
    
    if (!startDate || !endDate) return 0;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Check if form is ready for submission
  canSubmit(): boolean {
    return this.projectForm.valid && !this.isSubmitting;
  }

  // Get selected members details for preview
  getSelectedMembersNames(): string[] {
    const selectedIds = this.projectForm.get('members')?.value || [];
    return this.availableUsers
      .filter(user => selectedIds.includes(user._id))
      .map(user => `${user.firstName} ${user.lastName}`);
  }

  // Validate specific field
  isFieldInvalid(fieldName: string): boolean {
    const field = this.projectForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  // Get field error message
  getFieldError(fieldName: string): string {
    const field = this.projectForm.get(fieldName);
    if (!field || !field.errors) return '';

    const errors = field.errors;
    
    if (errors['required']) return `${this.getFieldDisplayName(fieldName)} is required`;
    if (errors['minlength']) return `${this.getFieldDisplayName(fieldName)} is too short`;
    if (errors['dateRange']) return 'End date must be after start date';
    
    return 'Invalid input';
  }

  // Get display name for form fields
  private getFieldDisplayName(fieldName: string): string {
    const fieldNames: { [key: string]: string } = {
      'title': 'Project title',
      'summary': 'Project summary',
      'members': 'Team members',
      'startDate': 'Start date',
      'endDate': 'End date',
      'status': 'Project status'
    };
    return fieldNames[fieldName] || fieldName;
  }

  // Handle form cancellation with unsaved changes warning
  onCancel() {
    if (this.projectForm.dirty && !this.isSubmitting) {
      const confirmLeave = confirm('You have unsaved changes. Are you sure you want to leave?');
      if (confirmLeave) {
        this.router.navigate(['/projects']);
      }
    } else {
      this.router.navigate(['/projects']);
    }
  }
}