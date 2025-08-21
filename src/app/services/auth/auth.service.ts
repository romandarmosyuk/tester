import { Injectable } from '@angular/core';
import {
  Auth,
  signOut,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<User | null | undefined>(undefined);
  user$ = this.userSubject.asObservable();

  constructor(private auth: Auth) {
    this.auth.onAuthStateChanged((user) => this.userSubject.next(user));
  }

  async loginEmail(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  async registerEmail(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  async logout() {
    await signOut(this.auth);
  }

  getUser() {
    return this.userSubject.value;
  }

  isLoggedIn() {
    const logged = !!this.userSubject.value;
    console.log('[AuthService] isLoggedIn →', logged);
    return logged;
  }

  get currentUser() {
    return this.auth.currentUser;
  }
}
