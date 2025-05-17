import { Component, inject } from '@angular/core';
import { ProductCardComponent } from '@products/components/product-card/product-card.component';
import { ProductsService } from '@products/services/products.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { Gender } from '@products/interfaces/product.interface';
import { JsonPipe } from '@angular/common';

@Component({
    selector: 'app-home-page',
    imports: [
        JsonPipe,
        ProductCardComponent
    ],
    templateUrl: './home-page.component.html',
})
export default class HomePageComponent {
    _productsService = inject(ProductsService);

    productsResource = rxResource({
        request: () => ({}),
        loader: ({ request }) => {
            return this._productsService.getProducts({})
                .pipe(tap(response => {
                    console.log('Response is', response)
                }))
        }
    })
}
