import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '@auth/interfaces/user.interface';
import { Gender, Product, ProductsResponse } from '@products/interfaces/product.interface';
import { forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;

interface Options {
    limit?: number;
    offset?: number;
    gender?: Gender | '';
}
const emptyProduct: Product = {
    id: 'new',
    title: '',
    price: 0,
    description: '',
    slug: '',
    stock: 0,
    sizes: [],
    gender: Gender.Men,
    tags: [],
    images: [],
    user: {} as User
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

        if (id === 'new') {
            return of(emptyProduct!);
        }

        if (this.productCache.has(key)) {
            return of(this.productCache.get(key)!);
        }
        return this._http.get<Product>(`${baseUrl}/products/${id}`).pipe(
            tap((response) => {
                this.productCache.set(key, response);
            })
        )
    }

    updateProduct(id: string, productLike: Partial<Product>, imageFileList?: FileList): Observable<Product> {
        const currentImages = productLike.images ?? [];

        return this.uploadImages(imageFileList)
            .pipe(
                map(imageNames => ({
                    ...productLike,
                    images: [...currentImages, ...imageNames]
                })),
                switchMap((updatedProduct) => {
                    return this._http.patch<Product>(`${baseUrl}/products/${id}`, updatedProduct)
                }),
                tap((response) => {
                    this.updateProductCache(response, false);
                })
            )
    }

    createProduct(productLike: Partial<Product>, imageFileList?: FileList): Observable<Product> {
        const currentImages = productLike.images ?? [];

        return this.uploadImages(imageFileList)
            .pipe(
                map(imageNames => ({
                    ...productLike,
                    images: [...currentImages, ...imageNames]
                })),
                switchMap((createdProduct) => {
                    return this._http.post<Product>(`${baseUrl}/products`, createdProduct)
                }),
                tap((response) => {
                    this.updateProductCache(response, true);
                })
            )
    }

    updateProductCache(product: Product, clearCache: boolean): void {
        const productId = product.id;
        const productSlug = product.slug;
        this.productCache.set(productId, product);
        this.productCache.set(productSlug, product);

        if (clearCache) {
            this.productsCache.clear();
            return;
        }

        this.productsCache.forEach(productResponse => {
            productResponse.products = productResponse.products
                .map((currentProduct) => {
                    return currentProduct.id === productId ? product : currentProduct;
                })
        });
    }

    uploadImages(images?: FileList): Observable<String[]> {
        if (!images) return of([]);

        const uploadObservables = Array.from(images).map(imageFile => this.uploadImage(imageFile));

        return forkJoin(uploadObservables)
            .pipe(
                tap((imageNames) => {
                    console.log('Uploaded images:', imageNames);
                }),
            )
    }

    uploadImage(imageFile: File): Observable<string> {
        const formData = new FormData();
        formData.append('file', imageFile);

        return this._http.post<{ fileName: string }>(`${baseUrl}/files/product`, formData)
            .pipe(
                map(response => response.fileName)
            )
    }
}
