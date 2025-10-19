import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonSelect, IonSelectOption, IonDatetime, IonDatetimeButton, IonModal, IonTextarea, IonButton, IonNote } from '@ionic/angular/standalone';
import { AppointmentService } from '../appointments/appointment.service';
import { AuthService } from '../auth/auth.service';

interface HospitalsData {
  state: string;
  districts: { district: string; cities: { city: string; governmentHospitals: string[] }[] }[];
}

@Component({
  selector: 'app-tab2',
  standalone: true,
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonSelect, IonSelectOption, IonDatetime, IonDatetimeButton, IonModal, IonTextarea, IonButton, IonNote]
})
export class Tab2Page implements OnInit {
  private data: HospitalsData | null = null;

  districts: string[] = [];
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

  constructor(private fb: FormBuilder, private http: HttpClient, private appt: AppointmentService, private auth: AuthService, private router: Router) {
    // React to district changes -> populate cities
    this.form.controls.district.valueChanges.subscribe(d => {
      this.form.controls.city.enable();
      this.form.controls.city.reset('');
      this.form.controls.hospital.reset('');
      this.form.controls.hospital.disable();
      const cities = this.getCitiesForDistrict(d || '');
      this.cities.set(cities);
    });

    // React to city changes -> populate hospitals
    this.form.controls.city.valueChanges.subscribe(c => {
      this.form.controls.hospital.enable();
      this.form.controls.hospital.reset('');
      const hospitals = this.getHospitalsForCity(this.form.controls.district.value || '', c || '');
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

  ngOnInit(): void {
    this.http.get<HospitalsData>('assets/tn-locations.json').subscribe((d) => {
      this.data = d;
      this.districts = d.districts.map(x => x.district);
    });
  }

  private getCitiesForDistrict(district: string): string[] {
    if (!this.data) return [];
    const d = this.data.districts.find(x => x.district === district);
    return d ? d.cities.map(c => c.city) : [];
  }

  private getHospitalsForCity(district: string, city: string): string[] {
    if (!this.data) return [];
    const d = this.data.districts.find(x => x.district === district);
    const c = d?.cities.find(y => y.city === city);
    return c ? c.governmentHospitals : [];
  }

  private generateSlots(): string[] {
    const slots: string[] = [];
    let hour = 9, minute = 0; // 09:00
    while (hour < 19 || (hour === 19 && minute === 0)) {
      const label = `${hour.toString().padStart(2,'0')}:${minute.toString().padStart(2,'0')}`;
      slots.push(label);
      minute += 30;
      if (minute >= 60) { minute = 0; hour += 1; }
      if (hour === 19 && minute > 0) break;
    }
    return slots; // 09:00 .. 18:30
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
