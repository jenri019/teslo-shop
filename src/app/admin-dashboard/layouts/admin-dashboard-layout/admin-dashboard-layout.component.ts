import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AdminDashboardSidemenuComponent } from "../../components/admin-dashboard-sidemenu/admin-dashboard-sidemenu.component";
import { AuthService } from '@auth/services/auth.service';

@Component({
    selector: 'app-admin-dashboard-layout',
    imports: [
        RouterOutlet,
        RouterLink,
        RouterLinkActive
        //AdminDashboardSidemenuComponent
    ],
    templateUrl: './admin-dashboard-layout.component.html',
})
export class AdminDashboardLayoutComponent {
    _authService = inject(AuthService);
    router = inject(Router);

    user = computed(() => {
        return this._authService.user();
    });
}
