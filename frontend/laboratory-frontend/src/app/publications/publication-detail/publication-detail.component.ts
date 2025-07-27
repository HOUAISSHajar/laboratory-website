import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PublicationService } from '../../core/services/publication.service';
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

  constructor(
    private route: ActivatedRoute,
    private publicationService: PublicationService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
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

  openFile(url: string) {
    if (url) {
      window.open(url, '_blank');
    }
  }
}