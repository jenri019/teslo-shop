import { Component, inject, input, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductCarouselComponent } from '@products/components/product-carousel/product-carousel.component';
import { Product } from '@products/interfaces/product.interface';
import { FormUtils } from '@utils/form-utils';
import { FormErrorLabelComponent } from "../../../../shared/components/form-error-label/form-error-label.component";
import { ProductsService } from '@products/services/products.service';
import { Router } from '@angular/router';

@Component({
    selector: 'product-details',
    imports: [
        ReactiveFormsModule,
        ProductCarouselComponent,
        FormErrorLabelComponent
    ],
    templateUrl: './product-details.component.html',
})
export class ProductDetailsComponent implements OnInit {
    product = input.required<Product>();
    sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

    _productsService = inject(ProductsService);
    _formBuilder = inject(FormBuilder);
    _router = inject(Router);

    productForm = this._formBuilder.group({
        title: ['', Validators.required],
        description: ['', Validators.required],
        slug: ['', [Validators.required, Validators.pattern(FormUtils.slugPattern)]],
        price: [0, [Validators.required, Validators.min(0)]],
        stock: [0, [Validators.required, Validators.min(0)]],
        sizes: [['']],
        images: [[]],
        tags: [''],
        gender: ['men', [Validators.required, Validators.pattern(/men|women|kid|unisex/)]],
    });

    ngOnInit() {
        this.setFormValue(this.product());
    }

    setFormValue(formLike: Partial<Product>) {
        this.productForm.reset(this.product() as any);
        this.productForm.patchValue({ tags: formLike.tags?.join(', ') });
        //this.productForm.patchValue(formLike as any);
    }

    oonSizeChange(size: string) {
        let currentSizes = this.productForm.value.sizes ?? [];
        if (currentSizes.includes(size)) currentSizes.splice(currentSizes.indexOf(size), 1);
        else currentSizes = [...currentSizes, size];

        this.productForm.patchValue({ sizes: currentSizes });
    }

    onSubmit() {
        const formValue = this.productForm.value;
        const productLike: Partial<Product> = {
            ...(formValue as any),
            tags: formValue.tags?.toLowerCase().split(',').map(tag => tag.trim()) ?? [],
        }

        if (this.product().id === 'new') {
            this._productsService.createProduct(productLike)
                .subscribe({
                    next: (response) => {
                        this._router.navigate(['/admin/product', response.id]);
                    }, error: (error) => {
                    }
                });
        }
        else {
            this._productsService.updateProduct(this.product().id, productLike)
                .subscribe({
                    next: (response) => {
                    }, error: (error) => {
                    }
                });
        }
    }
}
