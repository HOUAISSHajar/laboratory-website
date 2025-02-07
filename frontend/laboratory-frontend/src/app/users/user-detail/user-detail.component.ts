
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-user-detail',
  standalone: false,
  
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss'
})
export class UserDetailComponent implements OnInit {
  user: any = null;
  isLoading = true;
  baseUrl = environment.apiUrl;
  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.loadUser(userId);
    }
  }

  getPhotoUrl(): string {
    if (this.user && this.user.photo) {
      // Remove any leading slashes from the photo path
      const photoPath = this.user.photo.replace(/^\//, '');
      return `${this.baseUrl}/${photoPath}`;
    }
    return 'assets/default-avatar.png';
  }

  // Add this method to handle image loading errors
  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    if (imgElement) {
      imgElement.src = 'assets/default-avatar.png';
    }
  }

  private loadUser(id: string) {
    this.isLoading = true;
    this.userService.getUserById(id).subscribe({
      next: (data) => {
        this.user = data;
        console.log('User data:', data);
        console.log('Photo URL:', this.getPhotoUrl());
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading user:', error);
        this.snackBar.open('Error loading user', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }
}