import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  //   if (auth.isLoggedIn()) {
  //     return true;
  //   } else {
  //     router.navigate(['/dashboard']);
  //     return false;
  //   }
  return auth.user$.pipe(
    take(1), // ждём первое значение от Firebase
    map((user) => {
      if (user) {
        return true;
      } else {
        router.navigate(['/dashboard']);
        return false;
      }
    })
  );
};
