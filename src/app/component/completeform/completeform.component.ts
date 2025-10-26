import { Component, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonModal, IonItem, IonLabel, IonInput, IonTextarea,ModalController, IonList} from '@ionic/angular/standalone';


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
  ],
})
export class CompleteformComponent  implements OnInit {
@Input() appointmentId!: string;
  
  // Data model for the form
  formData:any = {
    diagnostic: '',
    prescription: '',
    bp: '',
    sugar: ''

  };
  // Used to control the modal (we'll inject the controller in Tab3Page)
  constructor(
    public modal : ModalController) {}
  ngOnInit(): void {
  }

  // This method should be provided by the parent component (Tab3Page)
  // when the modal is created, to handle closing and passing data.
  // We'll use a placeholder here and rely on the ModalController methods in Tab3Page.
  onCancel(modal: any) {
    modal.dismiss(null, 'cancel');
  }
  onComplete(modal: any) {
    // Basic validation
    if (!this.formData.diagnostic || !this.formData.prescription) {
      alert('Diagnostic and Prescription are required.');
      return;
    }

    // Dismiss the modal and pass the form data back
    modal.dismiss(this.formData, 'complete');
  }
}
