import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  getDocs,
  addDoc,
  doc,
  getDoc,
  query,
  where,
  DocumentData,
} from '@angular/fire/firestore';
import { Attempt, Question } from '../../models/models';
import { setDoc } from 'firebase/firestore';

@Injectable({ providedIn: 'root' })
export class BackendService {
  constructor(private firestore: Firestore) {}

  private normalize(docData: DocumentData, id: string): Question {
    return {
      id,
      text: String(docData['text'] ?? ''),
      options: Array.isArray(docData['options'])
        ? (docData['options'] as string[])
        : [],
      correct: Number(docData['correct'] ?? 0),
      topic: String(docData['topic'] ?? ''),
      theoryLink: String(docData['theoryLink'] ?? ''),
      task: String(docData['task'] ?? ''),
      hint: String(docData['hint'] ?? ''),
    };
  }

  async getAllQuestions(): Promise<Question[]> {
    const snap = await getDocs(collection(this.firestore, 'questions'));
    return snap.docs.map((d) => this.normalize(d.data(), d.id));
  }

  async saveAttempt(
    userId: string,
    attempt: Omit<Attempt, 'id'>
  ): Promise<string> {
    const ref = await addDoc(collection(this.firestore, 'attempts'), {
      ...attempt,
      userId,
      createdAt: Date.now(),
    });
    return ref.id;
  }

  async getAttemptById(id: string): Promise<Attempt | null> {
    const ref = doc(this.firestore, 'attempts', id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    const data = snap.data() as Omit<Attempt, 'id'>;
    return { id: snap.id, ...data };
  }

  async getAttempts(userId: string): Promise<Attempt[]> {
    const q = query(
      collection(this.firestore, 'attempts'),
      where('userId', '==', userId)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => {
      const data = d.data() as Omit<Attempt, 'id'>;
      return { id: d.id, ...data };
    });
  }

  async saveUsername(userId: string, username: string): Promise<void> {
    const ref = doc(this.firestore, `users/${userId}`);
    await setDoc(ref, { username }, { merge: true });
  }

  async getUsername(userId: string): Promise<string> {
    const ref = doc(this.firestore, `users/${userId}`);
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data()['username'] as string) ?? '' : '';
  }
}
