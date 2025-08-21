import { AuthService } from './auth.service';
import {
  Auth,
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from '@angular/fire/auth';

jest.mock('@angular/fire/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let authMock: jest.Mocked<Partial<Auth>>;

  beforeEach(() => {
    authMock = {
      onAuthStateChanged: jest.fn(),
      currentUser: null,
    };

    (authMock.onAuthStateChanged as jest.Mock).mockImplementation(
      (cb: (u: User | null) => void) => cb(null)
    );

    service = new AuthService(authMock as Auth);
  });

  it('создаётся', () => {
    expect(service).toBeTruthy();
  });

  it('isLoggedIn должен быть false, если нет пользователя', () => {
    expect(service.isLoggedIn()).toBe(false);
  });

  it('isLoggedIn должен быть true, если юзер есть', () => {
    const fakeUser = { uid: '1', email: 'a@test.com' } as unknown as User;
    (authMock.onAuthStateChanged as jest.Mock).mock.calls[0][0](fakeUser);

    expect(service.isLoggedIn()).toBe(true);
  });

  it('loginEmail вызывает signInWithEmailAndPassword', async () => {
    (signInWithEmailAndPassword as jest.Mock).mockResolvedValueOnce('ok');
    const result = await service.loginEmail('a@test.com', '123');
    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
      authMock,
      'a@test.com',
      '123'
    );
    expect(result).toBe('ok');
  });

  it('registerEmail вызывает createUserWithEmailAndPassword', async () => {
    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValueOnce('ok');
    const result = await service.registerEmail('a@test.com', '123');
    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
      authMock,
      'a@test.com',
      '123'
    );
    expect(result).toBe('ok');
  });

  it('logout вызывает signOut', async () => {
    (signOut as jest.Mock).mockResolvedValueOnce(undefined);
    await service.logout();
    expect(signOut).toHaveBeenCalledWith(authMock);
  });
});
