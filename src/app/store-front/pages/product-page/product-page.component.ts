import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductsService } from '@products/services/products.service';

@Component({
    selector: 'app-product-page',
    imports: [],
    templateUrl: './product-page.component.html',
})
export default class ProductPageComponent {
    route = inject(ActivatedRoute);
    _productsService = inject(ProductsService);

    productIdSlug = this.route.snapshot.paramMap.get('idSlug') ?? '';

    productResource = rxResource({
        request: () => ({ idSlug: this.productIdSlug }),
        loader: ({ request }) => {
            return this._productsService.getProductById(request.idSlug)
        }
    })
}
