import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PublicationService } from '../../core/services/publication.service';
import { AuthService } from '../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-publication-detail',
  standalone: false,
  templateUrl: './publication-detail.component.html',
  styleUrl: './publication-detail.component.scss'
})
export class PublicationDetailComponent implements OnInit {
  publication: any = null;
  isLoading = true;
  currentUser: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private publicationService: PublicationService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    const publicationId = this.route.snapshot.paramMap.get('id');
    if (publicationId) {
      this.loadPublication(publicationId);
    }
  }

  private loadPublication(id: string) {
    this.publicationService.getPublicationById(id).subscribe({
      next: (data) => {
        this.publication = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open('Error loading publication', 'Close', { duration: 3000 });
        this.isLoading = false;
        this.router.navigate(['/publications']);
      }
    });
  }

  getTypeDisplayName(type: string): string {
    const typeMap: { [key: string]: string } = {
      'article': 'Article',
      'book_chapter': 'Book Chapter',
      'thesis': 'Thesis',
      'conference_paper': 'Conference Paper'
    };
    return typeMap[type] || type;
  }

  getAuthorInitials(author: any): string {
    if (!author.firstName || !author.lastName) return 'U';
    return (author.firstName.charAt(0) + author.lastName.charAt(0)).toUpperCase();
  }

  canEdit(): boolean {
    if (!this.currentUser || !this.publication) return false;
    
    // Administrator can edit any publication
    if (this.currentUser.role === 'administrator') return true;
    
    // Authors can edit their own publications
    return this.publication.authors?.some((author: any) => author._id === this.currentUser.id);
  }

  canDelete(): boolean {
    if (!this.currentUser) return false;
    
    // Only administrators can delete publications
    return this.currentUser.role === 'administrator';
  }

  viewPublication(id: string) {
    // Already viewing, could implement full-screen view
    console.log('View full publication:', id);
  }

  editPublication(id: string) {
    this.router.navigate(['/publications/edit', id]);
  }

  deletePublication(id: string) {
    if (confirm('Are you sure you want to delete this publication? This action cannot be undone.')) {
      this.publicationService.deletePublication(id).subscribe({
        next: () => {
          this.snackBar.open('Publication deleted successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/publications']);
        },
        error: (error) => {
          this.snackBar.open('Error deleting publication', 'Close', { duration: 3000 });
        }
      });
    }
  }

  downloadPublication() {
    if (this.publication.fileUrl) {
      window.open(this.publication.fileUrl, '_blank');
    } else {
      this.snackBar.open('No file available for download', 'Close', { duration: 3000 });
    }
  }

  sharePublication() {
    if (navigator.share) {
      navigator.share({
        title: this.publication.title,
        text: `Check out this publication: ${this.publication.title}`,
        url: window.location.href
      }).catch(err => console.log('Error sharing:', err));
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href).then(() => {
        this.snackBar.open('Link copied to clipboard', 'Close', { duration: 3000 });
      }).catch(() => {
        this.snackBar.open('Could not copy link', 'Close', { duration: 3000 });
      });
    }
  }

  bookmarkPublication() {
    // Implement bookmark functionality
    this.snackBar.open('Bookmark feature coming soon', 'Close', { duration: 3000 });
  }

  citePublication() {
    // Generate citation
    const citation = this.generateCitation();
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(citation).then(() => {
        this.snackBar.open('Citation copied to clipboard', 'Close', { duration: 3000 });
      }).catch(() => {
        this.snackBar.open('Could not copy citation', 'Close', { duration: 3000 });
      });
    }
  }

  private generateCitation(): string {
    if (!this.publication) return '';
    
    const authors = this.publication.authors.map((author: any) => 
      `${author.lastName}, ${author.firstName.charAt(0)}.`
    ).join(', ');
    
    return `${authors} (${this.publication.year}). ${this.publication.title}. ${this.publication.journal || 'Unpublished'}.`;
  }

  openFile(url: string) {
    if (url) {
      window.open(url, '_blank');
    }
  }
}