

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../core/services/project.service';
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

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    const projectId = this.route.snapshot.paramMap.get('id');
    if (projectId) {
      this.loadProject(projectId);
    }
  }

  private loadProject(id: string) {
    this.projectService.getProjectById(id).subscribe({
      next: (data) => {
        this.project = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open('Error loading project', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }
}