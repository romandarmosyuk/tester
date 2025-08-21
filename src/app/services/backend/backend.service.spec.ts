import { BackendService } from './backend.service';
import { Firestore, getDocs, addDoc, getDoc } from '@angular/fire/firestore';
import { Attempt, Question } from '../../models/models';

jest.mock('@angular/fire/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
  addDoc: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
}));

describe('BackendService', () => {
  let service: BackendService;
  let firestoreMock: jest.Mocked<Partial<Firestore>>;

  beforeEach(() => {
    firestoreMock = {} as Partial<Firestore>;
    service = new BackendService(firestoreMock as Firestore);
    jest.clearAllMocks();
  });

  it('создаётся', () => {
    expect(service).toBeTruthy();
  });

  it('getAllQuestions возвращает список вопросов', async () => {
    const fakeQuestions: Question[] = [
      {
        id: '1',
        text: '2+2',
        options: ['3', '4'],
        correct: 1,
        topic: 'math',
        theoryLink: '',
        task: '',
        hint: '',
      },
    ];

    (getDocs as jest.Mock).mockResolvedValueOnce({
      docs: [
        {
          id: '1',
          data: () => ({
            text: '2+2',
            options: ['3', '4'],
            correct: 1,
            topic: 'math',
            theoryLink: '',
            task: '',
            hint: '',
          }),
        },
      ],
    });

    const result = await service.getAllQuestions();
    expect(result).toEqual(fakeQuestions);
  });

  it('saveAttempt вызывает addDoc и возвращает id', async () => {
    (addDoc as jest.Mock).mockResolvedValueOnce({ id: 'abc123' });

    const attempt: Omit<Attempt, 'id'> = {
      userId: 'u1',
      answers: [],
      createdAt: Date.now(),
      score: 1,
      total: 1,
      weakTopics: [],
    };

    const result = await service.saveAttempt('u1', attempt);
    expect(addDoc).toHaveBeenCalled();
    expect(result).toBe('abc123');
  });

  it('getAttemptById возвращает attempt, если найден', async () => {
    (getDoc as jest.Mock).mockResolvedValueOnce({
      exists: () => true,
      id: '123',
      data: () => ({
        userId: 'u1',
        answers: [],
        createdAt: 1,
        score: 1,
        total: 1,
        weakTopics: [],
      }),
    });

    const result = await service.getAttemptById('123');
    expect(result?.id).toBe('123');
    expect(result?.score).toBe(1);
  });

  it('getAttemptById возвращает null, если не найден', async () => {
    (getDoc as jest.Mock).mockResolvedValueOnce({
      exists: () => false,
    });

    const result = await service.getAttemptById('nope');
    expect(result).toBeNull();
  });

  it('getAttempts возвращает список', async () => {
    (getDocs as jest.Mock).mockResolvedValueOnce({
      docs: [
        {
          id: 'a1',
          data: () => ({
            userId: 'u1',
            answers: [],
            createdAt: 1,
            score: 1,
            total: 1,
            weakTopics: [],
          }),
        },
      ],
    });

    const result = await service.getAttempts('u1');
    expect(result[0].id).toBe('a1');
    expect(result[0].score).toBe(1);
  });
});
