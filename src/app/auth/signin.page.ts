import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton, IonList, IonNote } from '@ionic/angular/standalone';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-signin',
  standalone: true,
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton, IonList, IonNote,
  ],
})
export class SignInPage {
  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  submitting = false;
  errorMsg = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  coerceEmail(ev: Event) {
    const val = (ev as CustomEvent).detail?.value ?? '';
    const lower = String(val).toLowerCase();
    if (val !== lower) {
      this.form.controls.email.setValue(lower, { emitEvent: false });
    }
  }

  async onSubmit() {
    this.errorMsg = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting = true;
    const { email, password } = this.form.getRawValue();
    try {
      const ok = this.auth.signIn(email, password);
      if (ok) {
        await this.router.navigateByUrl('/tabs/tab1');
      } else {
        this.errorMsg = 'Invalid credentials.';
      }
    } finally {
      this.submitting = false;
    }
  }
}
