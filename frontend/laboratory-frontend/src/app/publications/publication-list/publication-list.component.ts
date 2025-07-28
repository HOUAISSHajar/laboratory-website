import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PublicationService } from '../../core/services/publication.service';
import { AuthService } from '../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-publication-list',
  standalone: false,
  templateUrl: './publication-list.component.html',
  styleUrl: './publication-list.component.scss'
})
export class PublicationListComponent implements OnInit {
  userRole: string = '';
  publications: any[] = [];
  isLoading = true;
  canCreatePublication = false;
  displayedColumns: string[] = ['title', 'type', 'year', 'authors', 'actions'];
  pageTitle: string = '';
  viewMode: 'card' | 'list' = 'list';
  
  constructor(
    private publicationService: PublicationService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    const currentUser = this.authService.getCurrentUser();
    this.userRole = currentUser?.role || '';
    this.canCreatePublication = ['administrator', 'faculty_researcher', 'phd_researcher'].includes(this.userRole);
    
    // Set title based on role
    if (['faculty_researcher', 'phd_researcher'].includes(this.userRole)) {
      this.pageTitle = 'My Publications';
    } else {
      this.pageTitle = 'All Publications';
    }
    
    this.loadPublications();
  }

  loadPublications() {
    this.publicationService.getAllPublications().subscribe({
      next: (data) => {
        this.publications = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open('Error loading publications', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  createNew() {
    this.router.navigate(['/publications/new']);
  }

  viewPublication(id: string) {
    this.router.navigate(['/publications', id]);
  }

  editPublication(id: string) {
    this.router.navigate(['/publications/edit', id]);
  }

  deletePublication(id: string) {
    if (confirm('Are you sure you want to delete this publication?')) {
      this.publicationService.deletePublication(id).subscribe({
        next: () => {
          this.snackBar.open('Publication deleted successfully', 'Close', { duration: 3000 });
          this.loadPublications();
        },
        error: (error) => {
          this.snackBar.open('Error deleting publication', 'Close', { duration: 3000 });
        }
      });
    }
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

  

  getTypeCount(type: string): number {
    return this.publications.filter(pub => pub.type === type).length;
  }

  getRecentCount(): number {
    const currentYear = new Date().getFullYear();
    return this.publications.filter(pub => pub.year === currentYear).length;
  }

  // Filter and search methods (to be implemented later)
  openFilterDialog() {
    // Implementation for filter dialog
    console.log('Opening filter dialog...');
  }

  openSearchDialog() {
    // Implementation for search dialog
    console.log('Opening search dialog...');
  }
}