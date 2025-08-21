import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { ReviewComponent } from './review.component';
import { Attempt, Question } from '../../models/models';

jest.mock('../../services/backend/backend.service', () => {
  return {
    BackendService: jest.fn().mockImplementation(() => ({
      getAttemptById: jest.fn(),
      getAllQuestions: jest.fn(),
    })),
  };
});

import { BackendService } from '../../services/backend/backend.service';

describe('ReviewComponent', () => {
  let component: ReviewComponent;
  let fixture: ComponentFixture<ReviewComponent>;
  let backendMock: jest.Mocked<BackendService>;
  let routerMock: jest.Mocked<Router>;

  beforeEach(async () => {
    backendMock =
      new (BackendService as jest.Mock<BackendService>)() as jest.Mocked<BackendService>;

    routerMock = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      imports: [ReviewComponent],
      providers: [
        { provide: BackendService, useValue: backendMock },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: new Map([['attemptId', '123']]) } },
        },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReviewComponent);
    component = fixture.componentInstance;

    // 👇 мок alert без ворнингов eslint
    jest.spyOn(window, 'alert').mockImplementation(jest.fn());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('создается', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit → редирект если попытки нет', async () => {
    backendMock.getAttemptById.mockResolvedValueOnce(null);
    backendMock.getAllQuestions.mockResolvedValueOnce([]);

    await component.ngOnInit();

    expect(window.alert).toHaveBeenCalledWith('Попытка не найдена');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('ngOnInit → загружает данные', async () => {
    const attempt: Attempt = {
      id: '123',
      userId: 'u1',
      answers: [],
      createdAt: 0,
      score: 0,
      total: 0,
      weakTopics: ['math'],
    };
    const questions: Question[] = [
      {
        id: 'q1',
        text: '2+2',
        options: ['3', '4'],
        correct: 1,
        topic: 'math',
        theoryLink: '',
        task: '',
        hint: '',
      },
    ];

    backendMock.getAttemptById.mockResolvedValueOnce(attempt);
    backendMock.getAllQuestions.mockResolvedValueOnce(questions);

    await component.ngOnInit();

    expect(component.attempt).toEqual(attempt);
    expect(component.mapQ['q1']).toEqual(questions[0]);
  });
});
