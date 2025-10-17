import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logOutOutline } from 'ionicons/icons';
import { AuthService, AuthUser } from '../auth/auth.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardContent],
})
export class Tab1Page implements OnInit {
  user: AuthUser | null = null;

  constructor(private auth: AuthService, private router: Router) {
    addIcons({ logOutOutline });
  }

  ngOnInit(): void {
    this.user = this.auth.currentUser;
    if (!this.user) {
      this.router.navigateByUrl('/auth/signin');
    }
  }

  logout() {
    this.auth.signOut();
    this.router.navigateByUrl('/auth/signin');
  }

  goToBook() {
    this.router.navigateByUrl('/tabs/tab2');
  }

  goToMyAppointments() {
    this.router.navigateByUrl('/tabs/tab3');
  }
}
