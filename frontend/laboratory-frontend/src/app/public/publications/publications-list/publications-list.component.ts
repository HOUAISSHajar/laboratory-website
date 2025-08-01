

import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PublicationService } from '../../../core/services/publication.service';
import { MatSnackBar } from '@angular/material/snack-bar';

interface PublicationType {
  value: string;
  label: string;
}

@Component({
  selector: 'app-publications-list',
  standalone: false,
  
  templateUrl: './publications-list.component.html',
  styleUrl: './publications-list.component.scss'
})
export class PublicationsListComponent implements OnInit {
  publications: any[] = [];
  filteredPublications: any[] = [];
  isLoading = true;
  searchControl = new FormControl('');
  selectedYear = 'all';
  selectedType = 'all';
  years: string[] = ['all'];
  publicationTypes: PublicationType[] = [
    { value: 'all', label: 'All Types' },
    { value: 'article', label: 'Articles' },
    { value: 'book_chapter', label: 'Book Chapters' },
    { value: 'thesis', label: 'Theses' },
    { value: 'conference_paper', label: 'Conference Papers' }
  ];

  constructor(
    private publicationService: PublicationService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
        this.loadPublications();
        this.setupSearchListener();
      }
    
      private loadPublications() {
        this.isLoading = true;
        this.publicationService.getAllPublications().subscribe({
          next: (data) => {
            this.publications = data;
            this.setupYearsList();
            this.filterPublications();
            this.isLoading = false;
          },
          error: (error) => {
            this.snackBar.open('Error loading publications', 'Close', { duration: 3000 });
            this.isLoading = false;
          }
        });
      }
    
      private setupYearsList() {
        const uniqueYears = new Set(this.publications.map(pub => pub.year.toString()));
        this.years = ['all', ...Array.from(uniqueYears).sort((a, b) => b.localeCompare(a))];
      }
    
      private setupSearchListener() {
        this.searchControl.valueChanges.subscribe(value => {
          this.filterPublications();
        });
      }
    
      filterPublications() {
        let filtered = [...this.publications];
    
        // Filter by year
        if (this.selectedYear !== 'all') {
          filtered = filtered.filter(pub => pub.year.toString() === this.selectedYear);
        }
    
        // Filter by type
        if (this.selectedType !== 'all') {
          filtered = filtered.filter(pub => pub.type === this.selectedType);
        }
    
        // Filter by search term
        const searchTerm = this.searchControl.value?.toLowerCase() || '';
        if (searchTerm) {
          filtered = filtered.filter(pub => 
            pub.title.toLowerCase().includes(searchTerm) ||
            pub.abstract?.toLowerCase().includes(searchTerm) ||
            pub.keywords?.some((keyword: string) => keyword.toLowerCase().includes(searchTerm)) ||
            pub.authors.some((author: any) => 
              `${author.firstName} ${author.lastName}`.toLowerCase().includes(searchTerm)
            )
          );
        }
    
        this.filteredPublications = filtered;
      }
    
      onYearChange() {
        this.filterPublications();
      }
    
      onTypeChange() {
        this.filterPublications();
      }
    
    
  getPublicationTypeLabel(type: string): string {
    const found = this.publicationTypes.find(t => t.value === type);
    return found ? found.label : type;
  }
}