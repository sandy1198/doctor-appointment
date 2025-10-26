import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonModal,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  ModalController,
  IonList,
  IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { star, starOutline } from 'ionicons/icons';

@Component({
  selector: 'app-completeform',
  templateUrl: './completeform.component.html',
  styleUrls: ['./completeform.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonButton,
    IonItem,
    IonList,
    IonLabel,
    IonInput,
    IonTextarea,
    IonIcon
  ],
})
export class CompleteformComponent implements OnInit {
  @Input() appointmentId!: string;
  @Input() isDoctor = false;  // 👈 NEW FLAG
  @Input() existingData: any; // 👈 to prefill when user gives feedback

  formData: any = {
    diagnostic: '',
    prescription: '',
    bp: '',
    sugar: '',
    feedback: '',
    rating: 0
  };

  constructor(public modalCtrl: ModalController) {
    addIcons({ star, starOutline });
  }

  ngOnInit(): void {
    if (this.existingData) {
      this.formData = { ...this.formData, ...this.existingData };
    }
  }

  setRating(star: number) {
    this.formData.rating = star;
  }

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  onComplete() {
    // doctor form validation
    if (this.isDoctor && (!this.formData.diagnostic || !this.formData.prescription)) {
      alert('Diagnostic and Prescription are required.');
      return;
    }

    this.modalCtrl.dismiss(this.formData, 'complete');
  }
}
