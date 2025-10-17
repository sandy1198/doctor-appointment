import { Component, computed, effect, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonSelect, IonSelectOption, IonDatetime, IonTextarea, IonButton, IonNote } from '@ionic/angular/standalone';
import { AppointmentService } from '../appointments/appointment.service';
import { AuthService } from '../auth/auth.service';

interface LocationData { district: string; city: string; hospital: string; }

const DATA: LocationData[] = [
  { district: 'Central', city: 'Metro City', hospital: 'City General Hospital' },
  { district: 'Central', city: 'Metro City', hospital: 'Metro Heart Clinic' },
  { district: 'Central', city: 'Old Town', hospital: 'Old Town Health Center' },
  { district: 'West', city: 'Riverside', hospital: 'Riverside Hospital' },
  { district: 'West', city: 'Lakeside', hospital: 'Lakeside Clinic' },
];

@Component({
  selector: 'app-tab2',
  standalone: true,
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [CommonModule, ReactiveFormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonSelect, IonSelectOption, IonDatetime, IonTextarea, IonButton, IonNote]
})
export class Tab2Page {
  districts = Array.from(new Set(DATA.map(d => d.district)));
  cities = signal<string[]>([]);
  hospitals = signal<string[]>([]);

  form = this.fb.nonNullable.group({
    district: ['', Validators.required],
    city: [{ value: '', disabled: true }, Validators.required],
    hospital: [{ value: '', disabled: true }, Validators.required],
    date: ['', Validators.required],
    time: [{ value: '', disabled: true }, Validators.required],
    message: [''],
  });

  minDate = new Date().toISOString();
  timeSlots = signal<string[]>([]);

  constructor(private fb: FormBuilder, private appt: AppointmentService, private auth: AuthService, private router: Router) {
    // React to district changes -> populate cities
    this.form.controls.district.valueChanges.subscribe(d => {
      this.form.controls.city.enable();
      this.form.controls.city.reset('');
      this.form.controls.hospital.reset('');
      this.form.controls.hospital.disable();
      const cities = Array.from(new Set(DATA.filter(x => x.district === d).map(x => x.city)));
      this.cities.set(cities);
    });

    // React to city changes -> populate hospitals
    this.form.controls.city.valueChanges.subscribe(c => {
      this.form.controls.hospital.enable();
      this.form.controls.hospital.reset('');
      const hospitals = Array.from(new Set(DATA.filter(x => x.city === c).map(x => x.hospital)));
      this.hospitals.set(hospitals);
    });

    // React to date changes -> enable time and generate slots
    this.form.controls.date.valueChanges.subscribe(v => {
      if (v) {
        this.form.controls.time.enable();
        this.timeSlots.set(this.generateSlots());
      } else {
        this.form.controls.time.reset('');
        this.form.controls.time.disable();
      }
    });
  }

  private generateSlots(): string[] {
    const slots: string[] = [];
    let hour = 9, minute = 0; // 09:00
    while (hour < 19 || (hour === 19 && minute === 0)) { // up to 19:00 exclusive start -> last start 18:30
      const label = `${hour.toString().padStart(2,'0')}:${minute.toString().padStart(2,'0')}`;
      slots.push(label);
      minute += 30;
      if (minute >= 60) { minute = 0; hour += 1; }
      if (hour === 19 && minute > 0) break;
    }
    return slots; // e.g., 09:00 ... 18:30
  }

  fmt(slot: string): string {
    const [h, m] = slot.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hh = (h % 12) || 12;
    return `${hh}:${m.toString().padStart(2,'0')} ${ampm}`;
  }

  async submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const u = this.auth.currentUser;
    if (!u) {
      await this.router.navigateByUrl('/auth/signin');
      return;
    }
    const { district, city, hospital, date, time, message } = this.form.getRawValue();
    this.appt.create({
      userEmail: u.email,
      userName: u.name,
      district,
      city,
      hospital,
      date: (typeof date === 'string' ? date : new Date(date).toISOString()).slice(0,10),
      time,
      message: message || undefined,
    });
    await this.router.navigateByUrl('/tabs/tab3');
  }
}
