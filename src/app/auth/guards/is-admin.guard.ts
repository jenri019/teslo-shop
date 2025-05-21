import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { firstValueFrom } from 'rxjs';

export const isAdminGuard: CanMatchFn = async (
    route: Route,
    segments: UrlSegment[]
) => {
    const _authService = inject(AuthService);
    const router = inject(Router);

    const isAuthenticated = await firstValueFrom(
        _authService.checkAuthStatus()
    );
    if (!isAuthenticated || !_authService.isAdmin()) {
        router.navigateByUrl('/');
        return false;
    }

    return true;
}
