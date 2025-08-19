import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth, authState, User } from '@angular/fire/auth';
import { BackendService } from '../../services/backend/backend.service';
import { QuizService } from '../../services/quiz/quiz.service';
import { Question, AttemptAnswer, Attempt } from '../../models/models';
import { Observable } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-quiz',
  imports: [CommonModule, FormsModule],
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.less'],
})
export class QuizComponent implements OnInit {
  user$: Observable<User | null>;

  current: { q: Question; isExtra: boolean } | null = null;
  chosen: number | null = null;

  answers: AttemptAnswer[] = [];
  score = 0;

  finished = false;
  savedAttemptId: string | null = null;

  constructor(
    private quiz: QuizService,
    private backend: BackendService,
    private router: Router,
    private auth: Auth
  ) {
    this.user$ = authState(this.auth);
  }

  async ngOnInit() {
    const all = await this.backend.getAllQuestions();
    this.quiz.bootstrap(all);
    this.next();
  }

  answer() {
    if (!this.current || this.chosen === null) return;

    const correct = this.quiz.handleAnswer(
      this.current.q,
      this.chosen,
      this.current.isExtra
    );

    if (!this.current.q.id) {
      throw new Error('У вопроса отсутствует id');
    }

    this.answers.push({
      questionId: this.current.q.id,
      chosen: this.chosen,
      correct,
      isExtra: this.current.isExtra,
    });

    if (correct) this.score++;
    this.chosen = null;

    this.next();
  }

  private next() {
    const n = this.quiz.getNext();
    if (!n) {
      this.finished = true;
      this.current = null;
      return;
    }
    this.current = n;
  }

  finishEarly() {
    this.router.navigate(['/dashboard']);
  }

  async saveAndOpen(userId: string) {
    const attempt: Omit<Attempt, 'id'> = {
      userId,
      answers: this.answers,
      createdAt: Date.now(),
      score: this.score,
      total: this.answers.length,
      weakTopics: Array.from(this.quiz.weakTopics),
    };

    this.savedAttemptId = await this.backend.saveAttempt(userId, attempt);
    this.router.navigate(['/review', this.savedAttemptId]);
  }
}
