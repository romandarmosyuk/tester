import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from '@angular/fire/auth';
import { BackendService } from 'src/app/services/backend/backend.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.less'],
})
export class LayoutComponent implements OnInit {
  username = '';
  email = '';
  userId: string | null = null;

  constructor(
    private auth: Auth,
    private backend: BackendService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.auth.onAuthStateChanged(async (user) => {
      if (user) {
        this.userId = user.uid;
        this.email = user.email ?? '';
        this.username = await this.backend.getUsername(user.uid);
      } else {
        this.userId = null;
        this.email = '';
        this.username = '';
      }
    });
  }
}
