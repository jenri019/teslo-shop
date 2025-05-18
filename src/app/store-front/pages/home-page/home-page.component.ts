import { Component, inject } from '@angular/core';
import { ProductCardComponent } from '@products/components/product-card/product-card.component';
import { ProductsService } from '@products/services/products.service';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

@Component({
    selector: 'app-home-page',
    imports: [
    ProductCardComponent,
    PaginationComponent
],
    templateUrl: './home-page.component.html',
})
export default class HomePageComponent {
    _productsService = inject(ProductsService);
    route = inject(ActivatedRoute);
    currentPage = toSignal(
        this.route.queryParamMap.pipe(
            map(params => {
                return params.get('page') ? +params.get('page')! : 1;
            }),
            map(page => {
                return isNaN(page) ? 1 : page;
            })
        ),
        { initialValue: 1 }
    );

    productsResource = rxResource({
        request: () => ({ page: this.currentPage() }),
        loader: ({ request }) => {
            return this._productsService.getProducts({
                offset: (request.page - 1) * 9,
            })
        }
    })
}
