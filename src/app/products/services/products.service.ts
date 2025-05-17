import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Gender, ProductsResponse } from '@products/interfaces/product.interface';
import { Observable } from 'rxjs';
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

    getProducts(options: Options): Observable<ProductsResponse> {
        const { limit = 10, offset = 0, gender = '' } = options;
        return this._http.get<ProductsResponse>(`${baseUrl}/products`, {
            params: {
                limit,
                offset,
                gender
            }
        })
    }
}
