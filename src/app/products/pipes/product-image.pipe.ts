import { Pipe, type PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;
@Pipe({
    name: 'productImage',
})
export class ProductImagePipe implements PipeTransform {
    transform(value: string | string[]): string {
        if (typeof value === 'string') return `${baseUrl}/files/product/${value}`;

        const image = value[0];
        if (!image) return '/assets/images/no-image.webp';

        return `${baseUrl}/files/product/${value[0]}`;
    }
}
