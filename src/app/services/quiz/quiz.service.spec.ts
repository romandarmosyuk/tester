import { TestBed } from '@angular/core/testing';
import { QuizService } from './quiz.service';
import { Question } from '../../models/models';

describe('QuizService', () => {
  let service: QuizService;

  const sampleQuestions: Question[] = [
    { id: '1', text: '2+2', options: ['3', '4'], correct: 1, topic: 'math' },
    { id: '2', text: '3+3', options: ['5', '6'], correct: 1, topic: 'math' },
    {
      id: '3',
      text: 'Sun rises in?',
      options: ['West', 'East'],
      correct: 1,
      topic: 'geo',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QuizService],
    });
    service = TestBed.inject(QuizService);
  });

  it('должен создаваться', () => {
    expect(service).toBeTruthy();
  });

  it('bootstrap() должен распределить вопросы по темам', () => {
    service.bootstrap(sampleQuestions);
    const first = service.getNext();
    expect(first).not.toBeNull();
    if (first) {
      expect(first.q).toHaveProperty('id');
    }
  });

  it('handleAnswer() должен добавлять доп. вопросы при ошибке', () => {
    service.bootstrap(sampleQuestions);

    // ⚡ ищем вопрос из темы "math", где есть несколько штук
    let q = service.getNext();
    while (q && q.q.topic !== 'math') {
      q = service.getNext();
    }

    expect(q).not.toBeNull();
    if (q) {
      const result = service.handleAnswer(q.q, 0, false);
      expect(result).toBe(false);

      const extra = service.getNext();
      expect(extra).not.toBeNull();
      if (extra) {
        expect(extra.isExtra).toBe(true); // ✅ теперь точно true
      }
    }
  });
});
