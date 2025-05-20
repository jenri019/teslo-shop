import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@auth/services/auth.service';

@Component({
    selector: 'app-register-page',
    imports: [
        RouterLink,
        ReactiveFormsModule
    ],
    templateUrl: './register-page.component.html',
})
export default class RegisterPageComponent {
    _formBuilder = inject(FormBuilder);
    _authService = inject(AuthService);
    router = inject(Router);
    isPosting = signal(false);
    hasError = signal(false);
    errorMessage = signal('');

    loginForm = this._formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        fullName: ['', [Validators.required, Validators.minLength(5)]],
    });

    onSubmit() {
        this.isPosting.set(true);
        if (this.loginForm.invalid) {
            this.isPosting.set(false);
            this.showingError('Please fill in all fields correctly.');
            return;
        }

        const { email = '', password = '', fullName = '' } = this.loginForm.value;

        this._authService.register(email!, password!, fullName!)
            .subscribe({
                next: (isRegistered) => {
                    this.isPosting.set(false);
                    if (isRegistered) {
                        this.router.navigateByUrl('/auth/login');
                        return;
                    }
                    this.showingError('An error occurred during registration.');
                },
                error: (error) => {
                    this.isPosting.set(false);
                    this.showingError('An error occurred during registration.');
                }
            })
    }

    showingError(message: string) {
        this.errorMessage.set(message);
        this.hasError.set(true);
        // Simulate a login request
        setTimeout(() => {
            this.hasError.set(false);
            // Handle successful login here
        }, 2000);
    }
}
