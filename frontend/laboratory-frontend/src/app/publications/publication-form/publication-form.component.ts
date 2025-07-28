import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PublicationService } from '../../core/services/publication.service';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-publication-form',
  standalone: false,
  templateUrl: './publication-form.component.html',
  styleUrl: './publication-form.component.scss'
})
export class PublicationFormComponent implements OnInit {
  publicationForm: FormGroup;
  isEditing = false;
  publicationId: string | null = null;
  isLoading = false;
  availableUsers: any[] = [];
  selectedFile: File | null = null;
  currentUserId: string = '';

  publicationTypes = [
    { value: 'article', label: 'Article' },
    { value: 'book_chapter', label: 'Book Chapter' },
    { value: 'thesis', label: 'Thesis' },
    { value: 'conference_paper', label: 'Conference Paper' }
  ];

  constructor(
    private fb: FormBuilder,
    private publicationService: PublicationService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.publicationForm = this.fb.group({
      title: ['', Validators.required],
      type: ['', Validators.required],
      year: ['', [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear() + 5)]],
      abstract: [''],
      keywords: this.fb.array([]),
      authors: [[], Validators.required],
      journal: [''],
      doi: ['']
    });
  }

  ngOnInit() {
    // Get current user ID
    const currentUser = this.authService.getCurrentUser();
    this.currentUserId = currentUser?.id || '';
    
    this.loadUsers();
    this.publicationId = this.route.snapshot.paramMap.get('id');
    if (this.publicationId) {
      this.isEditing = true;
      this.loadPublication(this.publicationId);
    }
  }

  get keywords(): FormArray {
    return this.publicationForm.get('keywords') as FormArray;
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

  loadPublication(id: string) {
    this.isLoading = true;
    this.publicationService.getPublicationById(id).subscribe({
      next: (publication) => {
        this.publicationForm.patchValue({
          title: publication.title,
          type: publication.type,
          year: publication.year,
          abstract: publication.abstract,
          authors: publication.authors.map((author: any) => author._id),
          journal: publication.journal || '',
          doi: publication.doi || ''
        });

        // Load keywords
        const keywordsArray = this.keywords;
        keywordsArray.clear();
        if (publication.keywords) {
          publication.keywords.forEach((keyword: string) => {
            keywordsArray.push(this.fb.control(keyword));
          });
        }

        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open('Error loading publication', 'Close', { duration: 3000 });
        this.isLoading = false;
        this.router.navigate(['/publications']);
      }
    });
  }

  addKeyword() {
    this.keywords.push(this.fb.control(''));
  }

  removeKeyword(index: number) {
    this.keywords.removeAt(index);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        this.snackBar.open('Only PDF, DOC, and DOCX files are allowed', 'Close', { duration: 3000 });
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        this.snackBar.open('File size must be less than 10MB', 'Close', { duration: 3000 });
        return;
      }

      this.selectedFile = file;
      this.snackBar.open(`File "${file.name}" selected`, 'Close', { duration: 2000 });
    }
  }

  onSubmit() {
  if (this.publicationForm.valid) {
    this.isLoading = true;
    const publicationData = {
      ...this.publicationForm.value,
      keywords: this.keywords.value.filter((keyword: string) => keyword.trim() !== '')
    };

    const request = this.isEditing
      ? this.publicationService.updatePublication(this.publicationId!, publicationData)
      : this.publicationService.createPublication(publicationData);

    request.subscribe({
      next: () => {
        this.snackBar.open(
          `Publication ${this.isEditing ? 'updated' : 'created'} successfully`, // ← Changez 'created' au lieu de 'published'
          'Close',
          { duration: 3000 }
        );
        this.router.navigate(['/publications']);
      },
      error: (error) => {
        this.snackBar.open(
          `Error ${this.isEditing ? 'updating' : 'creating'} publication`, // ← Changez 'creating' au lieu de 'publishing'
          'Close',
          { duration: 3000 }
        );
        this.isLoading = false;
      }
    });
  } else {
    // Mark all fields as touched to show validation errors
    this.markFormGroupTouched(this.publicationForm);
    this.snackBar.open('Please fill in all required fields correctly', 'Close', { duration: 3000 });
  }
}

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Helper methods for template
  getCurrentYear(): number {
    return new Date().getFullYear();
  }

  getTypeIcon(type: string): string {
    const iconMap: { [key: string]: string } = {
      'article': 'article',
      'book_chapter': 'book',
      'thesis': 'school',
      'conference_paper': 'event'
    };
    return iconMap[type] || 'library_books';
  }

  getUserInitials(user: any): string {
    if (!user.firstName || !user.lastName) return 'U';
    return (user.firstName.charAt(0) + user.lastName.charAt(0)).toUpperCase();
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

  getSelectedAuthors(): any[] {
    const selectedIds = this.publicationForm.get('authors')?.value || [];
    return this.availableUsers.filter(user => selectedIds.includes(user._id));
  }

  saveAsDraft() {
    // Implementation for saving as draft
    this.snackBar.open('Draft save feature coming soon', 'Close', { duration: 3000 });
  }

  previewPublication() {
    // Implementation for preview
    this.snackBar.open('Preview feature coming soon', 'Close', { duration: 3000 });
  }

  // Form validation helpers
  isFieldInvalid(fieldName: string): boolean {
    const field = this.publicationForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.publicationForm.get(fieldName);
    if (field && field.errors) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['min']) return `${fieldName} must be at least ${field.errors['min'].min}`;
      if (field.errors['max']) return `${fieldName} must be at most ${field.errors['max'].max}`;
    }
    return '';
  }
}