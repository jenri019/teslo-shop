import { Component, effect, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '@products/services/products.service';
import { map, tap } from 'rxjs';
import { ProductDetailsComponent } from './product-details/product-details.component';

@Component({
    selector: 'app-product-admin-page',
    imports: [
        ProductDetailsComponent
    ],
    templateUrl: './product-admin-page.component.html',
})
export default class ProductAdminPageComponent {
    ativatedRoute = inject(ActivatedRoute);
    router = inject(Router);
    _productsService = inject(ProductsService);

    productId = toSignal(
        this.ativatedRoute.params.pipe(
            map((params) => params['id']),
        )
    )

    productResource = rxResource({
        request: () => ({ id: this.productId() }),
        loader: ({ request }) => {
            return this._productsService.getProductById(request.id).pipe(
                tap((response) => {
                })
            )
        }
    });

    redirectEffect = effect(() => {
        if (this.productResource.error()) {
            this.router.navigate(['/admin/products']);
        }
    });
}
