import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth, authState, User } from '@angular/fire/auth';
import { BackendService } from '../../services/backend/backend.service';
import { Attempt } from '../../models/models';

@Component({
  standalone: true,
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.less'],
})
export class ProfileComponent implements OnInit {
  attempts: Attempt[] = [];
  userId: string | null = null;
  email: string | null = null;
  username = '';
  editingName = false;

  constructor(
    private backend: BackendService,
    private router: Router,
    private auth: Auth
  ) {}

  ngOnInit() {
    authState(this.auth).subscribe(async (user: User | null) => {
      if (!user) {
        this.userId = null;
        this.email = null;
        return;
      }

      this.userId = user.uid;
      this.email = user.email;

      this.username = await this.backend.getUsername(this.userId);

      const list = await this.backend.getAttempts(this.userId);
      this.attempts = list.sort((a, b) => b.createdAt - a.createdAt);
    });
  }

  formatDate(timestamp: number): string {
    return new Date(timestamp).toLocaleString();
  }

  async saveUsername() {
    if (this.userId && this.username.trim()) {
      await this.backend.saveUsername(this.userId, this.username.trim());
      this.editingName = false;
    }
  }

  viewAttempt(id: string) {
    this.router.navigate(['/review', id]);
  }

  logout() {
    this.auth.signOut().then(() => this.router.navigate(['/']));
  }
}
