import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PublicationService } from '../../../core/services/publication.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';

@Component({
  selector: 'app-publication-detail',
  standalone: false,
  
  templateUrl: './publication-detail.component.html',
  styleUrl: './publication-detail.component.scss'
})

export class PublicationDetailComponent implements OnInit {
  publication: any = null;
  isLoading = true;
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private publicationService: PublicationService,
    private snackBar: MatSnackBar,
    private location: Location
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPublication(id);
    }
  }

  loadPublication(id: string) {
    this.isLoading = true;
    this.publicationService.getPublicationById(id).subscribe({
      next: (data) => {
        this.publication = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Publication not found';
        this.snackBar.open(this.error, 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  goBack() {
    this.location.back();
  }

  getPublicationTypeLabel(type: string): string {
    const types: { [key: string]: string } = {
      article: 'Article',
      book_chapter: 'Book Chapter',
      thesis: 'Thesis',
      conference_paper: 'Conference Paper'
    };
    return types[type] || type;
  }
}