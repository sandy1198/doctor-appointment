import { Injectable } from '@angular/core';

export type AppointmentStatus = 'Awaiting' | 'Accepted' |  'Completed' | 'Rejected' ;

export interface Appointment {
  id: string;
  userEmail: string;
  userName?: string;
  district: string;
  city: string;
  hospital: string;
  doctorName?: string;
  doctorSpecialisation?: string;
  date: string; // ISO date (yyyy-mm-dd)
  time: string; // HH:mm
  message?: string;
  status?: AppointmentStatus;
  createdAt: number;
  diagnostic?: string;
  prescription?: string;
  bp?: string; // Optional
  sugar?: string; // Optional
}

const STORAGE_KEY = 'appointments';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private readAll(): Appointment[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    try {
      return raw ? (JSON.parse(raw) as Appointment[]) : [];
    } catch {
      return [];
    }
  }

  private writeAll(list: Appointment[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  create(data: Omit<Appointment, 'id' | 'status' | 'createdAt'>): Appointment {
    const all = this.readAll();
    const appt: Appointment = {
      ...data,
      id: crypto.randomUUID(),
      status: 'Awaiting',
      createdAt: Date.now(),
    };
    all.push(appt);
    this.writeAll(all);
    return appt;
  }

  listMine(userEmail: string): Appointment[] {
    return this.readAll().filter((a) => a.userEmail === userEmail).sort((a,b) => a.createdAt - b.createdAt);
  }

  listAll(): Appointment[] {
    return this.readAll().sort((a,b) => a.createdAt - b.createdAt);
  }

  updateStatus(id: string, status: AppointmentStatus): void {
    const all = this.readAll();
    console.log(all);
    
    const idx = all.findIndex((a) => a.id === id);
    console.log(idx);
    
    if (idx >= 0) {
      all[idx] = { ...all[idx], status };
      console.log(all);
      
      this.writeAll(all);
    }
  }
  completeAppointment(id: string, details: { diagnostic: string; prescription: string; bp?: string; sugar?: string; feedback?:string; rating?: any  }): void {
    const all = this.readAll();
    const idx = all.findIndex((a) => a.id === id);
    
    if (idx >= 0) {
      all[idx] = { 
        ...all[idx], 
        status: 'Completed',
        diagnostic: details.diagnostic,
        prescription: details.prescription,
        bp: details.bp,
        sugar: details.sugar
      };
      this.writeAll(all);
    }
  }
  addFeedback(id: string, data: any) {
  const all = this.listAll();
  const index = all.findIndex(a => a.id === id);
  if (index >= 0) {
    all[index] = { ...all[index], ...data };
    localStorage.setItem('appointments', JSON.stringify(all));
  }
}

}
