import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '@products/services/products.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { ProductCardComponent } from "../../../products/components/product-card/product-card.component";

@Component({
    selector: 'app-gender-page',
    imports: [ProductCardComponent],
    templateUrl: './gender-page.component.html',
})
export default class GenderPageComponent {
    route = inject(ActivatedRoute);
    _productsService = inject(ProductsService);

    gender = toSignal(
        this.route.params.pipe(
            map(({ gender }) => gender)
        )
    )

    productsResource = rxResource({
        request: () => ({ gender: this.gender() }),
        loader: ({ request }) => {
            return this._productsService.getProducts({
                gender: request.gender
            });
        }
    })
}
