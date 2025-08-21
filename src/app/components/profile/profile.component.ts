// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { Auth, authState, User } from '@angular/fire/auth';
// import { BackendService } from '../../services/backend/backend.service';
// import { Attempt } from '../../models/models';

// @Component({
//   standalone: true,
//   selector: 'app-profile',
//   imports: [CommonModule, FormsModule],
//   templateUrl: './profile.component.html',
//   styleUrls: ['./profile.component.less'],
// })
// export class ProfileComponent implements OnInit {
//   attempts: Attempt[] = [];
//   userId: string | null = null;
//   email: string | null = null;

//   constructor(
//     private backend: BackendService,
//     private router: Router,
//     private auth: Auth
//   ) {}

//   ngOnInit() {
//     authState(this.auth).subscribe(async (user: User | null) => {
//       if (!user) {
//         this.userId = null;
//         this.email = null;
//         return;
//       }

//       this.userId = user.uid;
//       this.email = user.email;

//       const list = await this.backend.getAttempts(this.userId);
//       this.attempts = list.sort((a, b) => b.createdAt - a.createdAt);
//     });
//   }

//   formatDate(timestamp: number): string {
//     return new Date(timestamp).toLocaleString();
//   }

//   viewAttempt(id: string) {
//     this.router.navigate(['/review', id]);
//   }

//   logout() {
//     this.auth.signOut().then(() => this.router.navigate(['/']));
//   }
// }
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { BackendService } from '../../services/backend/backend.service';
import { Attempt } from '../../models/models';
import { User } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.less'],
})
export class ProfileComponent implements OnInit {
  user$: Observable<User | null | undefined>;
  attempts: Attempt[] = [];

  constructor(
    private backend: BackendService,
    private router: Router,
    private auth: AuthService
  ) {
    this.user$ = this.auth.user$;
  }

  ngOnInit() {
    this.user$.subscribe(async (user) => {
      if (!user) {
        this.attempts = [];
        return;
      }

      const list = await this.backend.getAttempts(user.uid);
      this.attempts = list.sort((a, b) => b.createdAt - a.createdAt);
    });
  }

  formatDate(timestamp: number): string {
    return new Date(timestamp).toLocaleString();
  }

  viewAttempt(id: string) {
    this.router.navigate(['/review', id]);
  }

  async logout() {
    await this.auth.logout();
    this.router.navigate(['/dashboard']); // или на главную
  }
}
