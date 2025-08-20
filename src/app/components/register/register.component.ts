import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less'],
})
export class RegisterComponent {
  email = '';
  password = '';
  password2 = '';

  constructor(private auth: AuthService, private router: Router) {}

  async register() {
    if (this.password !== this.password2) {
      alert('Пароли не совпадают');
      return;
    }
    try {
      await this.auth.registerEmail(this.email, this.password);

      this.router.navigate(['/dashboard']);
    } catch (e) {
      alert('Ошибка регистрации: ' + (e as Error).message);
    }
  }

  close() {
    this.router.navigate(['/dashboard']);
  }
}
