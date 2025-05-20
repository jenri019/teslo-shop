import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthResponse } from '@auth/interfaces/auth-response.interface';
import { User } from '@auth/interfaces/user.interface';
import { rxResource } from '@angular/core/rxjs-interop';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';
const baseUrl = environment.baseUrl;

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private _authStatus = signal<AuthStatus>('checking');
    private _user = signal<User | null>(null);
    private _token = signal<string | null>(localStorage.getItem('token'));

    private _http = inject(HttpClient);

    productsResource = rxResource({
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

    checkAuthStatus(): Observable<boolean> {
        const token = localStorage.getItem('token');
        if (!token) {
            this.logout();
            return of(false);
        }

        return this._http.get<AuthResponse>(`${baseUrl}/auth/check-status`, {
            /* headers: {
                Authorization: `Bearer ${token}`
            } */
        }).pipe(
            map((response) => {
                return this.handleAuthSuccess(response);
            }),
            catchError((err: any) => {
                return this.handleAuthError(err);
            })
        )
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

        //localStorage.removeItem('token');
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
}
