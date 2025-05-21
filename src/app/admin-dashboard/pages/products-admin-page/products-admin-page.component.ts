import { Component, inject, signal } from '@angular/core';
import { ProductTableComponent } from "../../../products/components/product-table/product-table.component";
import { PaginationComponent } from "../../../shared/components/pagination/pagination.component";
import { ProductsService } from '@products/services/products.service';
import { PaginationService } from '@shared/services/pagination.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { tap } from 'rxjs';
import { Router } from '@angular/router';

@Component({
    selector: 'app-products-admin-page',
    imports: [
        FormsModule,
        ProductTableComponent,
        PaginationComponent
    ],
    templateUrl: './products-admin-page.component.html',
})
export default class ProductsAdminPageComponent {
    _productsService = inject(ProductsService);
    _paginationService = inject(PaginationService);
    limitPage = signal<number>(10);

    router = inject(Router);

    limitPerPageChange(value: number) {
        this.limitPage.set(value);
        this.router.navigateByUrl('/admin/products');
    }

    productsResource = rxResource({
        request: () => ({
            page: this._paginationService.currentPage() - 1,
            limit: this.limitPage(),
        }),
        loader: ({ request }) => {
            return this._productsService.getProducts({
                offset: request.page * request.limit,
                limit: request.limit,
            }).pipe(
                tap((response) => {
                    console.log('Loading products...', response)
                })
            )
        }
    })
}
