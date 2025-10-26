import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonBadge, IonButton, IonAccordion, IonAccordionGroup ,ModalController} from '@ionic/angular/standalone';
import { Appointment, AppointmentService } from '../appointments/appointment.service';
import { AuthService } from '../auth/auth.service';
import { CompleteformComponent } from '../component/completeform/completeform.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tab3',
  standalone: true,
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [CommonModule,FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonBadge, IonButton, IonAccordionGroup, IonAccordion],
})
export class Tab3Page implements OnInit {
  items = signal<Appointment[]>([]);
  isDoctor = false;

  constructor(private appt: AppointmentService, private auth: AuthService, private modalCtrl: ModalController) {}

  ngOnInit(): void {
    
  }

ionViewDidEnter() {
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

  async complete(id: string) {
    const modal = await this.modalCtrl.create({
      component: CompleteformComponent, // The new component
      componentProps: {
        appointmentId: id, // Pass the ID to the modal
      },
      // Give the modal a reference so we can access its methods in the HTML
      id: 'complete-appointment-modal'
    });
    
    await modal.present();

    // 2. Wait for the modal to be dismissed
    const { data, role } = await modal.onWillDismiss();

    // 3. Check the role (did they click 'complete'?)
    if (role === 'complete' && data) {
      // 4. If so, complete the appointment
      this.appt.completeAppointment(id, data);
      this.refresh();
    }
  }
  getBadgeColor(status?:any): string {
    switch (status) {
      case 'Accepted':
        return 'success';
      case 'Rejected':
        return 'danger';
      case 'Completed':
        return 'tertiary';
      case 'Awaiting':
        return 'warning';
      default:
        return 'primary'; // Default color
    }
  }
}
