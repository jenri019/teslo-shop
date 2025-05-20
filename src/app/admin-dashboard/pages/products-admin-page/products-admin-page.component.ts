import { Component, inject } from '@angular/core';
import { ProductTableComponent } from "../../../products/components/product-table/product-table.component";
import { PaginationComponent } from "../../../shared/components/pagination/pagination.component";
import { ProductsService } from '@products/services/products.service';
import { PaginationService } from '@shared/services/pagination.service';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-products-admin-page',
    imports: [ProductTableComponent, PaginationComponent],
    templateUrl: './products-admin-page.component.html',
})
export default class ProductsAdminPageComponent {
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
