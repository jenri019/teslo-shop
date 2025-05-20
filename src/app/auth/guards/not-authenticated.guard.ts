import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { firstValueFrom } from 'rxjs';

export const NotAuthenticatedGuard: CanMatchFn = async (
    route: Route,
    segments: UrlSegment[]
) => {
    console.log('NotAuthenticatedGuard');
    const _authService = inject(AuthService);
    const router = inject(Router);

    const isAuthenticated = await firstValueFrom(
        _authService.checkAuthStatus()
    );

    if (isAuthenticated) {
        router.navigateByUrl('/');
        return false;
    }
    return true;
}
