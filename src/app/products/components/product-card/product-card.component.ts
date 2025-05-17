import { SlicePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '@products/interfaces/product.interface';
import { ProductImagePipe } from '@products/pipes/product-image.pipe';

@Component({
  selector: 'app-product-card',
  imports: [
    ProductImagePipe,
    RouterLink,
    SlicePipe
  ],
  templateUrl: './product-card.component.html',
})
export class ProductCardComponent {
    product = input.required<Product>();
}
