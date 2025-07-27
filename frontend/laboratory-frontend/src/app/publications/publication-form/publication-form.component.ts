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
      authors: [[], Validators.required]
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
          authors: publication.authors.map((author: any) => author._id)
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
      }
    });
  }

  addKeyword() {
    this.keywords.push(this.fb.control(''));
  }

  removeKeyword(index: number) {
    this.keywords.removeAt(index);
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
            `Publication ${this.isEditing ? 'updated' : 'created'} successfully`,
            'Close',
            { duration: 3000 }
          );
          this.router.navigate(['/publications']);
        },
        error: (error) => {
          this.snackBar.open(
            `Error ${this.isEditing ? 'updating' : 'creating'} publication`,
            'Close',
            { duration: 3000 }
          );
          this.isLoading = false;
        }
      });
    }
  }
}