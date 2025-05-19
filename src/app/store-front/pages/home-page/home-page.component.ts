import { Component, inject } from '@angular/core';
import { ProductCardComponent } from '@products/components/product-card/product-card.component';
import { ProductsService } from '@products/services/products.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { PaginationService } from '@shared/services/pagination.service';
import { JsonPipe } from '@angular/common';

@Component({
    selector: 'app-home-page',
    imports: [
        ProductCardComponent,
        PaginationComponent,
        JsonPipe
    ],
    templateUrl: './home-page.component.html',
})
export default class HomePageComponent {
    _productsService = inject(ProductsService);
    _paginationService = inject(PaginationService);

    productsResource = rxResource({
        request: () => ({ page: this._paginationService.currentPage() - 1 }),
        loader: ({ request }) => {
            return this._productsService.getProducts({
                offset: (request.page) * 9,
            })
        }
    })
}
