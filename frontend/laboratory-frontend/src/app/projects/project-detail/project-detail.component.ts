import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../core/services/project.service';
import { AuthService } from '../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-project-detail',
  standalone: false,
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss'
})
export class ProjectDetailComponent implements OnInit {
  project: any = null;
  isLoading = true;
  userRole: string = '';
  currentUserId: string = '';
  canUploadDocument = false;
  canDeleteDocument = false;
  
  // Upload dialog properties
  showUploadDialog = false;
  selectedFile: File | null = null;
  documentTitle = '';
  uploadInProgress = false;

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    const currentUser = this.authService.getCurrentUser();
    this.userRole = currentUser?.role || '';
    this.currentUserId = currentUser?.id || '';
    
    const projectId = this.route.snapshot.paramMap.get('id');
    if (projectId) {
      this.loadProject(projectId);
    }
  }

  private loadProject(id: string) {
    this.projectService.getProjectById(id).subscribe({
      next: (data) => {
        this.project = data;
        this.checkPermissions();
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open('Error loading project', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  private checkPermissions() {
    if (this.project && this.currentUserId) {
      // Check if user is a member of the project
      const isMember = this.project.members.some((member: any) => member._id === this.currentUserId);
      const isAdmin = this.userRole === 'administrator';
      
      // Upload/Delete permissions: only project members and admin
      this.canUploadDocument = isMember || isAdmin;
      this.canDeleteDocument = isMember || isAdmin;
    }
  }

  // New methods for modern features
  getStatusDisplayName(status: string): string {
    const statusMap: { [key: string]: string } = {
      'ongoing': 'Ongoing',
      'completed': 'Completed',
      'pending': 'Pending'
    };
    return statusMap[status] || status;
  }

  getRoleDisplayName(role: string): string {
    const roleMap: { [key: string]: string } = {
      'faculty_researcher': 'Faculty Researcher',
      'phd_researcher': 'PhD Researcher',
      'administrator': 'Administrator',
      'associated_member': 'Associated Member'
    };
    return roleMap[role] || role;
  }

  getProjectProgress(): number {
    if (!this.project) return 0;

    // Calculate progress based on project status and timeline
    const now = new Date();
    const startDate = new Date(this.project.startDate);
    const endDate = new Date(this.project.endDate);

    if (this.project.status === 'completed') {
      return 100;
    }

    if (this.project.status === 'pending' || now < startDate) {
      return 0;
    }

    if (now > endDate) {
      return this.project.status === 'ongoing' ? 90 : 100;
    }

    // Calculate based on time elapsed
    const totalDuration = endDate.getTime() - startDate.getTime();
    const elapsed = now.getTime() - startDate.getTime();
    const progress = Math.round((elapsed / totalDuration) * 100);

    return Math.min(Math.max(progress, 0), 95); // Cap at 95% if ongoing
  }

  getDaysRemaining(): number {
    if (!this.project) return 0;
    const now = new Date();
    const endDate = new Date(this.project.endDate);
    const diffTime = endDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  isProjectOverdue(): boolean {
    if (!this.project) return false;
    const now = new Date();
    const endDate = new Date(this.project.endDate);
    return now > endDate && this.project.status !== 'completed';
  }

  // Upload dialog methods
  openUploadDialog() {
    this.showUploadDialog = true;
    this.selectedFile = null;
    this.documentTitle = '';
  }

  closeUploadDialog() {
    this.showUploadDialog = false;
    this.selectedFile = null;
    this.documentTitle = '';
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        this.snackBar.open('File size must be less than 10MB', 'Close', { duration: 3000 });
        return;
      }

      // Check file type
      const allowedTypes = [
        'application/pdf', 
        'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      if (allowedTypes.includes(file.type)) {
        this.selectedFile = file;
        // Set default title to filename without extension
        if (!this.documentTitle) {
          this.documentTitle = file.name.replace(/\.[^/.]+$/, '');
        }
      } else {
        this.snackBar.open('Only PDF and Word documents are allowed', 'Close', { duration: 3000 });
      }
    }
  }

  uploadDocument() {
    if (!this.selectedFile || !this.project || !this.documentTitle.trim()) return;

    this.uploadInProgress = true;
    const formData = new FormData();
    formData.append('document', this.selectedFile);
    formData.append('title', this.documentTitle.trim());

    this.projectService.uploadDocument(this.project._id, formData).subscribe({
      next: (response) => {
        this.snackBar.open('Document uploaded successfully', 'Close', { duration: 3000 });
        this.loadProject(this.project._id); // Reload project to show new document
        this.closeUploadDialog();
        this.uploadInProgress = false;
      },
      error: (error) => {
        this.snackBar.open('Error uploading document', 'Close', { duration: 3000 });
        this.uploadInProgress = false;
      }
    });
  }

  deleteDocument(documentId: string, fileName: string) {
    if (!this.project) return;

    if (confirm(`Are you sure you want to delete "${fileName}"?`)) {
      this.projectService.deleteDocument(this.project._id, documentId).subscribe({
        next: () => {
          this.snackBar.open('Document deleted successfully', 'Close', { duration: 3000 });
          this.loadProject(this.project._id); // Reload project to update documents list
        },
        error: (error) => {
          this.snackBar.open('Error deleting document', 'Close', { duration: 3000 });
        }
      });
    }
  }

  // File utility methods
  getFileExtension(filename: string): string {
    const extension = filename.split('.').pop()?.toLowerCase();
    return extension ? `.${extension.toUpperCase()}` : '';
  }

  getFileType(filename: string): string {
    const extension = filename.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return 'PDF Document';
      case 'doc':
        return 'Word Document';
      case 'docx':
        return 'Word Document';
      default:
        return 'Document';
    }
  }

  getDocumentIcon(filename: string): string {
    const extension = filename.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return 'picture_as_pdf';
      case 'doc':
      case 'docx':
        return 'description';
      default:
        return 'insert_drive_file';
    }
  }

  getDocumentIconClass(filename: string): string {
    const extension = filename.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return 'pdf-icon';
      case 'doc':
      case 'docx':
        return 'word-icon';
      default:
        return 'default-icon';
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Additional utility methods
  getProjectDuration(): number {
    if (!this.project) return 0;
    const start = new Date(this.project.startDate);
    const end = new Date(this.project.endDate);
    const diffTime = end.getTime() - start.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getTimeElapsed(): number {
    if (!this.project) return 0;
    const now = new Date();
    const startDate = new Date(this.project.startDate);
    
    if (now < startDate) return 0;
    
    const diffTime = now.getTime() - startDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getMemberCount(): number {
    return this.project?.members?.length || 0;
  }

  getDocumentCount(): number {
    return this.project?.documents?.length || 0;
  }
}