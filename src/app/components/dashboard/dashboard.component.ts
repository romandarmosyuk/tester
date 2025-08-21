import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Observable } from 'rxjs';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgIf],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less'],
})
export class DashboardComponent {
  user$: Observable<User | null | undefined>;

  constructor(private router: Router, private auth: AuthService) {
    this.user$ = this.auth.user$;
  }

  startQuiz() {
    this.router.navigate(['/quiz']);
  }
}
