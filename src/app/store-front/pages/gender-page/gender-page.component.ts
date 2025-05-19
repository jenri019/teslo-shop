import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '@products/services/products.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { PaginationService } from '@shared/services/pagination.service';
import { ProductCardComponent } from '@products/components/product-card/product-card.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';

@Component({
    selector: 'app-gender-page',
    imports: [ProductCardComponent, PaginationComponent],
    templateUrl: './gender-page.component.html',
})
export default class GenderPageComponent {
    route = inject(ActivatedRoute);
    _productsService = inject(ProductsService);
    _paginationService = inject(PaginationService);

    gender = toSignal(
        this.route.params.pipe(
            map(({ gender }) => gender)
        )
    )

    productsResource = rxResource({
        request: () => ({
            gender: this.gender(),
            page: this._paginationService.currentPage() - 1
        }),
        loader: ({ request }) => {
            return this._productsService.getProducts({
                gender: request.gender,
                offset: (request.page) * 9,
            });
        }
    })
}
