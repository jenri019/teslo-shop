import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@auth/services/auth.service';

@Component({
    selector: 'app-login-page',
    imports: [
        RouterLink,
        ReactiveFormsModule
    ],
    templateUrl: './login-page.component.html',
})
export default class LoginPageComponent {
    _formBuilder = inject(FormBuilder);
    _authService = inject(AuthService);
    hasError = signal(false);
    isPosting = signal(false);
    errorMessage = signal('');

    loginForm = this._formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
    });

    onSubmit() {
        this.isPosting.set(true);
        if (this.loginForm.invalid) {
            this.isPosting.set(false);
            this.showingError('Please fill in all fields correctly.');
            return;
        }
        this.isPosting.set(false);

        const { email = '', password = '' } = this.loginForm.value;

        this._authService.login(email!, password!)
            .subscribe(response => {
                console.log(response);
            }, error => {
                this.showingError('Invalid email or password.');
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
