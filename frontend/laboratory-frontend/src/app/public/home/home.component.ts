// frontend/laboratory-frontend/src/app/public/home/home.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  // Données temporaires statiques (en attendant les services)
  recentProjects: any[] = [
    {
      _id: '1',
      title: 'Projet de Recherche en IA',
      summary: 'Développement d\'algorithmes d\'intelligence artificielle pour l\'analyse de données scientifiques',
      status: 'ongoing',
      members: [1, 2, 3],
      startDate: '2024-01-15'
    },
    {
      _id: '2', 
      title: 'Étude sur les Énergies Renouvelables',
      summary: 'Analyse de l\'efficacité des panneaux solaires dans le climat marocain',
      status: 'completed',
      members: [1, 2],
      startDate: '2023-09-01'
    }
  ];

  recentPublications: any[] = [
    {
      _id: '1',
      title: 'Machine Learning Applications in Scientific Research',
      year: 2024,
      type: 'article',
      abstract: 'This paper explores the applications of machine learning in various scientific domains',
      authors: [1, 2],
      journal: 'Journal of Scientific Computing'
    },
    {
      _id: '2',
      title: 'Renewable Energy Systems in Morocco',
      year: 2024,
      type: 'conference_paper',
      abstract: 'Analysis of renewable energy potential in North African countries',
      authors: [1, 2, 3],
      journal: 'International Conference on Renewable Energy'
    }
  ];

  upcomingEvents: any[] = [
    {
      _id: '1',
      title: 'Conférence Internationale sur l\'IA',
      type: 'conference',
      date: '2025-02-15',
      location: 'Faculté des Sciences Ain Chock',
      description: 'Une conférence sur les dernières avancées en intelligence artificielle et leurs applications'
    },
    {
      _id: '2',
      title: 'Séminaire sur les Énergies Vertes',
      type: 'seminar',
      date: '2025-03-10',
      location: 'Amphithéâtre A',
      description: 'Présentation des projets de recherche en cours sur les énergies renouvelables'
    }
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    // Plus besoin de charger depuis les services pour l'instant
    console.log('🎉 HomeComponent chargé avec succès !');
  }

  // Méthode pour aller vers la page de connexion  
  goToLogin() {
    this.router.navigate(['/login']);
  }
}