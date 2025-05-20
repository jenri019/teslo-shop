import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { logginInterceptor } from '@shared/interceptors/loggin.interceptor';
import { authInterceptor } from '@auth/interceptors/auth.interceptor';

import { provideImgixLoader } from '@angular/common';
import { IMAGE_CONFIG } from '@angular/common';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        provideHttpClient(
            withFetch(),
            withInterceptors([
                //logginInterceptor,
                authInterceptor
            ])
        ),
        provideImgixLoader('http://localhost:3000/'), // o tu base URL
        {
            provide: IMAGE_CONFIG, useValue: {
                disableImageSizeWarning: true,
                disableImageLazyLoadWarning: true
            }
        }
    ]
};
