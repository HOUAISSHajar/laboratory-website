
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-profile',
  standalone: false,
  
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  user: any;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: [{ value: '', disabled: true }],
      department: [''],
      description: [''],
      researchInterests: ['']
    });
  }

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.isLoading = true;
    const currentUser = this.authService.getCurrentUser();
    
    if (currentUser && currentUser.id) {
      this.user = currentUser; // Store the user object
      this.userService.getUserById(currentUser.id).subscribe({
        next: (userData) => {
          this.profileForm.patchValue({
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            department: userData.department || '',
            description: userData.description || '',
            researchInterests: userData.researchInterests?.join(', ') || ''
          });
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading profile:', error);
          this.snackBar.open('Error loading profile', 'Close', { duration: 3000 });
          this.isLoading = false;
        }
      });
    } else {
      this.snackBar.open('User information not found', 'Close', { duration: 3000 });
      this.isLoading = false;
    }
  }

  onSubmit() {
    if (this.profileForm.valid && this.user && this.user.id) {
      this.isLoading = true;
      const formData = this.profileForm.getRawValue();
      
      const updateData = {
        ...formData,
        researchInterests: formData.researchInterests
          ? formData.researchInterests.split(',').map((item: string) => item.trim())
          : []
      };

      console.log('Updating user with ID:', this.user.id);
      console.log('Update data:', updateData);

      this.userService.updateUser(this.user.id, updateData).subscribe({
        next: (response) => {
          // Update the stored user data
          const currentUser = this.authService.getCurrentUser();
          if (currentUser) {
            const updatedUser = { ...currentUser, ...updateData };
            localStorage.setItem('user', JSON.stringify(updatedUser));
          }
          
          this.snackBar.open('Profile updated successfully', 'Close', { duration: 3000 });
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error updating profile:', error);
          this.snackBar.open(
            error.error?.message || 'Error updating profile', 
            'Close', 
            { duration: 3000 }
          );
          this.isLoading = false;
        }
      });
    }
  }
}