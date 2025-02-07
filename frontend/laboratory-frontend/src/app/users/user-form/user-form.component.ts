
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-user-form',
  standalone: false,
  
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  isEditing = false;
  userId: string | null = null;
  isLoading = false;
  imagePreview: string | null = null;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['', Validators.required],
      department: [''],
      description: ['']
    });
  }

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id');
    if (this.userId) {
      this.isEditing = true;
      this.loadUser(this.userId);
      this.userForm.get('password')?.setValidators(null);
    }
  }

  onImagePicked(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
  private getPhotoUrl(photoPath: string): string {
    if (!photoPath) return 'assets/default-avatar.png';
    const cleanPath = photoPath.startsWith('/') ? photoPath.slice(1) : photoPath;
    return `${environment.apiUrl}/${cleanPath}`;
  }

  loadUser(id: string) {
    this.isLoading = true;
    this.userService.getUserById(id).subscribe({
      next: (user) => {
        this.userForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          department: user.department,
          description: user.description
        });
        // Update this line to use getPhotoUrl
        this.imagePreview = user.photo ? this.getPhotoUrl(user.photo) : null;
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open('Error loading user', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.isLoading = true;
      const userData = new FormData();
      Object.keys(this.userForm.value).forEach(key => {
        userData.append(key, this.userForm.value[key]);
      });
      if (this.selectedFile) {
        userData.append('photo', this.selectedFile);
      }

      const request = this.isEditing
        ? this.userService.updateUser(this.userId!, userData)
        : this.userService.createUser(userData);

      request.subscribe({
        next: () => {
          this.snackBar.open(
            `User ${this.isEditing ? 'updated' : 'created'} successfully`,
            'Close',
            { duration: 3000 }
          );
          this.router.navigate(['/users']);
        },
        error: (error) => {
          this.snackBar.open(
            `Error ${this.isEditing ? 'updating' : 'creating'} user`,
            'Close',
            { duration: 3000 }
          );
          this.isLoading = false;
        }
      });
    }
  }
}