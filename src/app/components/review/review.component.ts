import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BackendService } from '../../services/backend/backend.service';
import { Attempt, Question } from '../../models/models';

@Component({
  standalone: true,
  selector: 'app-review',
  imports: [CommonModule],
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.less'],
})
export class ReviewComponent implements OnInit {
  attempt: Attempt | null = null;
  mapQ: Record<string, Question> = {};
  topicInfo: Record<
    string,
    { theoryLink?: string; task?: string; hint?: string }
  > = {};
  hintVisibleByTopic: Record<string, boolean> = {};

  constructor(
    private backend: BackendService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('attemptId');
    if (!id) return;

    const attempt = await this.backend.getAttemptById(id);
    if (!attempt) {
      alert('Попытка не найдена');
      this.router.navigate(['/dashboard']);
      return;
    }
    this.attempt = attempt;

    const all = await this.backend.getAllQuestions();
    this.mapQ = all.reduce((acc, q) => {
      if (q.id) {
        acc[q.id] = q;
      }
      return acc;
    }, {} as Record<string, Question>);

    (attempt.weakTopics ?? []).forEach((t) => {
      const first = all.find((q) => q.topic === t);
      if (first) {
        this.topicInfo[t] = {
          theoryLink: first.theoryLink,
          task: first.task,
          hint: first.hint,
        };
      } else {
        this.topicInfo[t] = {};
      }
    });
  }

  toggleHint(topic: string) {
    this.hintVisibleByTopic[topic] = !this.hintVisibleByTopic[topic];
  }

  toDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
