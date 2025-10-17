import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonBadge, IonButton } from '@ionic/angular/standalone';
import { Appointment, AppointmentService } from '../appointments/appointment.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-tab3',
  standalone: true,
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonBadge, IonButton],
})
export class Tab3Page implements OnInit {
  items = signal<Appointment[]>([]);
  isDoctor = false;

  constructor(private appt: AppointmentService, private auth: AuthService) {}

  ngOnInit(): void {
    const u = this.auth.currentUser;
    this.isDoctor = !!u && u.role === 'doctor';
    this.refresh();
  }

  refresh() {
    const u = this.auth.currentUser;
    this.items.set(this.isDoctor ? this.appt.listAll() : (u ? this.appt.listMine(u.email) : []));
  }

  accept(id: string) {
    this.appt.updateStatus(id, 'Accepted');
    this.refresh();
  }

  reject(id: string) {
    this.appt.updateStatus(id, 'Rejected');
    this.refresh();
  }
}
