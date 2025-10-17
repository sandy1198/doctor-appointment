import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton, IonList, IonNote } from '@ionic/angular/standalone';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton, IonList, IonNote,
  ],
})
export class SignUpPage {
  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9()+\-\s]{7,}$/)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  submitting = false;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  async onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting = true;
    const { name, email, phone, password } = this.form.getRawValue();
    try {
      const ok = this.auth.signUp({ name, email, phone, password });
      if (ok) {
        await this.router.navigateByUrl('/tabs/tab1');
      }
    } finally {
      this.submitting = false;
    }
  }
}
