import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { QuizComponent } from './components/quiz/quiz.component';
import { ReviewComponent } from './components/review/review.component';
import { ProfileComponent } from './components/profile/profile.component';
import { authGuard } from './guards/auth/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

export const appRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },

      { path: 'quiz', redirectTo: 'quiz/arrays', pathMatch: 'full' },

      { path: 'quiz/:topicId', component: QuizComponent },

      { path: 'review/:attemptId', component: ReviewComponent },

      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [authGuard],
      },

      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: '**', redirectTo: 'dashboard' },
    ],
  },
];
