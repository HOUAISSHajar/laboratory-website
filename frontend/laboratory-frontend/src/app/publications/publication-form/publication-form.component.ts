// @Component({
//   selector: 'app-publication-form',
//   standalone: false,
  
//   templateUrl: './publication-form.component.html',
//   styleUrl: './publication-form.component.scss'
// })
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PublicationService } from '../../core/services/publication.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-publication-form',
  standalone: false,
  
  templateUrl: './publication-form.component.html',
  styleUrl: './publication-form.component.scss'
})
export class PublicationFormComponent implements OnInit {
  publicationForm: FormGroup;
  isLoading = false;
  isEditing = false;
  publicationId: string | null = null;

  publicationTypes = [
    { value: 'article', label: 'Article' },
    { value: 'book_chapter', label: 'Book Chapter' },
    { value: 'thesis', label: 'Thesis' },
    { value: 'conference_paper', label: 'Conference Paper' }
  ];

  constructor(
    private fb: FormBuilder,
    private publicationService: PublicationService,
    public router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.publicationForm = this.fb.group({
      title: ['', [Validators.required]],
      type: ['', [Validators.required]],
      year: ['', [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear())]],
      journal: [''],
      doi: [''],
      abstract: [''],
      keywords: ['']
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditing = true;
        this.publicationId = params['id'];
        this.loadPublication(params['id']);
      }
    });
  }

  loadPublication(id: string): void {
    this.isLoading = true;
    this.publicationService.getPublicationById(id).subscribe({
      next: (publication) => {
        this.publicationForm.patchValue({
          ...publication,
          keywords: publication.keywords?.join(', ')
        });
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open('Error loading publication', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.publicationForm.valid) {
      this.isLoading = true;
      const formData = this.publicationForm.value;
      
      // Convert keywords string to array
      const keywords = formData.keywords
        ? formData.keywords.split(',').map((k: string) => k.trim()).filter((k: string) => k)
        : [];

      const publicationData = {
        ...formData,
        keywords,
        authors: [] 
      };

      const request$ = this.isEditing
        ? this.publicationService.updatePublication(this.publicationId!, publicationData)
        : this.publicationService.createPublication(publicationData);

      request$.subscribe({
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
            error.error?.message || `Error ${this.isEditing ? 'updating' : 'creating'} publication`,
            'Close',
            { duration: 3000 }
          );
          this.isLoading = false;
        }
      });
    }
  }
}