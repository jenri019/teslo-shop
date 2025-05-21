import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthResponse } from '@auth/interfaces/auth-response.interface';
import { User } from '@auth/interfaces/user.interface';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';
const baseUrl = environment.baseUrl;

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private _authStatus = signal<AuthStatus>('checking');
    private _user = signal<User | null>(null);
    private _token = signal<string | null>(localStorage.getItem('token'));
    private router = inject(Router);
    private _authCacheResponse = new Map<string, AuthResponse>();
    private _authCacheResponseExp = signal(0);

    private _http = inject(HttpClient);

    // Resource to check the authentication status aat the start
    checkStatusResource = rxResource({
        loader: () => {
            return this.checkAuthStatus()
        }
    })

    authStatus = computed<AuthStatus>(() => {
        if (this._authStatus() === 'checking') return 'checking';

        if (this._user()) return 'authenticated';

        return 'not-authenticated';
    });

    user = computed<User | null>(() => {
        return this._user();
    })

    token = computed<string | null>(() => {
        return this._token();
    })

    isAdmin = computed(() => {
        return this._user()?.roles.includes('admin') ?? false;
    })

    checkAuthStatus(): Observable<boolean> {
        const token = localStorage.getItem('token');

        if (!token) {
            this.logout();
            return of(false);
        }

        if (this._authCacheResponse.has('user')) {
            const differenceInMinutes = (Date.now() - this._authCacheResponseExp()) / (1000 * 60);

            if (differenceInMinutes <= 15) {
                this.handleAuthSuccess(this._authCacheResponse.get('user')!);
                return of(true);
            }
        }

        return this._http.get<AuthResponse>(`${baseUrl}/auth/check-status`, {})
            .pipe(
                tap((resp) => {
                    this._authCacheResponse.set('user', resp);
                    this._authCacheResponseExp.set(Date.now());
                }),
                map((resp) => this.handleAuthSuccess(resp)),
                catchError((error) => this.handleAuthError(error))
            );
    }

    login(email: string, password: string): Observable<boolean> {
        return this._http.post<AuthResponse>(`${baseUrl}/auth/login`,
            {
                email,
                password
            }).pipe(
                map((response) => {
                    return this.handleAuthSuccess(response);
                }),
                catchError((err: any) => {
                    return this.handleAuthError(err);
                })
            )
    }

    logout() {
        this._user.set(null);
        this._token.set(null);
        this._authStatus.set('not-authenticated');

        localStorage.removeItem('token');
    }

    private handleAuthSuccess({ user, token }: AuthResponse) {
        this._user.set(user);
        this._authStatus.set('authenticated');
        this._token.set(token);

        localStorage.setItem('token', token);
        return true;
    }

    private handleAuthError(error: any) {
        this.logout();
        return of(false);
    }

    register(email: string, password: string, fullName: string): Observable<boolean> {
        return this._http.post<AuthResponse>(`${baseUrl}/auth/register`,
            {
                email,
                password,
                fullName
            }).pipe(
                map(() => {
                    return true;
                }),
                catchError(() => {
                    return of(false);
                })
            )
    }
}
