import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Gender, Product, ProductsResponse } from '@products/interfaces/product.interface';
import { Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;

interface Options {
    limit?: number;
    offset?: number;
    gender?: Gender | '';
}

@Injectable({
    providedIn: 'root'
})
export class ProductsService {
    private _http = inject(HttpClient);
    private productsCache = new Map<string, ProductsResponse>();
    private productCache = new Map<string, Product>();

    getProducts(options: Options): Observable<ProductsResponse> {
        const { limit = 10, offset = 0, gender = '' } = options;
        const key = `${limit}-${offset}-${gender}`;

        if (this.productsCache.has(key)) {
            return of(this.productsCache.get(key)!);
        }

        return this._http.get<ProductsResponse>(`${baseUrl}/products`, {
            params: {
                limit,
                offset,
                gender
            }
        }).pipe(
            tap((response) => {
                this.productsCache.set(key, response);
            })
        )
    }

    getProductByIdSlug(idSlug: string): Observable<Product> {
        const key = idSlug;

        if (this.productCache.has(key)) {
            return of(this.productCache.get(key)!);
        }
        return this._http.get<Product>(`${baseUrl}/products/${idSlug}`).pipe(
            tap((response) => {
                this.productCache.set(key, response);
            })
        )
    }

    getProductById(id: string): Observable<Product> {
        const key = id;

        if (this.productCache.has(key)) {
            return of(this.productCache.get(key)!);
        }
        return this._http.get<Product>(`${baseUrl}/products/${id}`).pipe(
            tap((response) => {
                this.productCache.set(key, response);
            })
        )
    }
}
