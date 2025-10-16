import { Injectable } from '@angular/core';

export interface AuthUser {
  name?: string;
  email: string;
  phone?: string;
}

const STORAGE_KEY = 'auth_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  get currentUser(): AuthUser | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    try {
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      return null;
    }
  }

  isSignedIn(): boolean {
    return !!this.currentUser;
  }

  signIn(email: string, password: string): boolean {
    // Mock: accept any non-empty credentials; in real app, call backend
    if (email && password) {
      const user: AuthUser = { email };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      return true;
    }
    return false;
  }

  signUp(data: { name: string; email: string; phone: string; password: string }): boolean {
    if (data.name && data.email && data.phone && data.password) {
      const user: AuthUser = { name: data.name, email: data.email, phone: data.phone };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      return true;
    }
    return false;
  }

  signOut(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
}
