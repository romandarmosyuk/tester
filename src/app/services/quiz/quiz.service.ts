import { Injectable } from '@angular/core';
import { Question } from '../../models/models';

type QWithFlag = { q: Question; isExtra: boolean };

@Injectable({ providedIn: 'root' })
export class QuizService {
  private baseQueue: Question[] = [];
  private baseIndex = 0;

  private extraPools = new Map<string, Question[]>();
  private pendingExtras: Question[] = [];
  private extrasActiveTopic: string | null = null;
  private extrasWrongCount = 0;

  private used: Set<string> = new Set();
  public weakTopics: Set<string> = new Set();

  private shuffle<T>(arr: T[]): T[] {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  bootstrap(questions: Question[]) {
    const byTopic = new Map<string, Question[]>();
    for (const q of questions) {
      const t = q.topic || '';
      if (!byTopic.has(t)) {
        byTopic.set(t, []);
      }
      const arr = byTopic.get(t);
      if (arr) {
        arr.push(q);
      }
    }

    const topics = this.shuffle(Array.from(byTopic.keys()));

    this.baseQueue = [];
    this.extraPools.clear();
    for (const t of topics) {
      const arr = byTopic.get(t);
      if (!arr || arr.length === 0) continue;

      const shuffled = this.shuffle(arr);
      const [main, ...rest] = shuffled;
      this.baseQueue.push(main);
      this.extraPools.set(t, rest);
    }

    this.baseIndex = 0;
    this.pendingExtras = [];
    this.extrasActiveTopic = null;
    this.extrasWrongCount = 0;
    this.used.clear();
    this.weakTopics.clear();
  }

  getNext(): QWithFlag | null {
    if (this.pendingExtras.length > 0) {
      const q = this.pendingExtras.shift();
      if (!q) return null;
      if (q.id) this.used.add(q.id);
      return { q, isExtra: true };
    }

    if (this.baseIndex < this.baseQueue.length) {
      const q = this.baseQueue[this.baseIndex++];
      if (q.id) this.used.add(q.id);
      return { q, isExtra: false };
    }

    return null;
  }

  handleAnswer(q: Question, chosen: number, isExtra: boolean): boolean {
    const correct = q.correct === chosen;
    const topic = q.topic;

    if (isExtra) {
      if (!correct) this.extrasWrongCount++;

      if (this.pendingExtras.length === 0) {
        if (this.extrasActiveTopic && this.extrasWrongCount >= 1) {
          this.weakTopics.add(this.extrasActiveTopic);
        }
        this.extrasActiveTopic = null;
        this.extrasWrongCount = 0;
      }
      return correct;
    }

    if (!correct) {
      const pool = this.extraPools.get(topic) ?? [];

      const candidates = pool.filter((x) =>
        x.id ? !this.used.has(x.id) : true
      );

      const extras = this.shuffle(candidates).slice(0, 2);

      if (extras.length > 0) {
        this.pendingExtras.push(...extras);
        this.extrasActiveTopic = topic;
        this.extrasWrongCount = 0;
      } else {
        this.weakTopics.add(topic);
      }
    }

    return correct;
  }
}
