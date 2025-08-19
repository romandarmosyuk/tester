import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private auth: AuthService, private router: Router) {}

  async loginEmail() {
    try {
      await this.auth.loginEmail(this.email, this.password);
      this.router.navigate(['/dashboard']);
    } catch (e) {
      alert('Ошибка входа: ' + (e as Error).message);
    }
  }

  goRegister() {
    this.router.navigate(['/register']);
  }

  close() {
    this.router.navigate(['/dashboard']);
  }
}
