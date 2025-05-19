import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PaginationService {
    activatedRoute = inject(ActivatedRoute);
    currentPage = toSignal(
        this.activatedRoute.queryParamMap.pipe(
            map(params => {
                return params.get('page') ? +params.get('page')! : 1;
            }),
            map(page => {
                return isNaN(page) ? 1 : page;
            })
        ),
        { initialValue: 1 }
    );
}
