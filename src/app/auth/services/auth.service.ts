import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthResponse } from '@auth/interfaces/auth-response.interface';
import { User } from '@auth/interfaces/user.interface';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';
const baseUrl = environment.baseUrl;

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private _authStatus = signal<AuthStatus>('checking');
    private _user = signal<User | null>(null);
    private _token = signal<string | null>(null);

    private _http = inject(HttpClient);

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

    login(email: string, password: string): Observable<AuthResponse> {
        return this._http.post<AuthResponse>(`${baseUrl}/auth/login`,
            {
                email,
                password
            }).pipe(
                tap((response) => {
                    this._user.set(response.user);
                    this._authStatus.set('authenticated');
                    this._token.set(response.token);

                    localStorage.setItem('token', response.token);
                })
            );
    }
}
