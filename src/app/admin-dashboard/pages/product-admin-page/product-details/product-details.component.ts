import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductCarouselComponent } from '@products/components/product-carousel/product-carousel.component';
import { Product } from '@products/interfaces/product.interface';
import { FormUtils } from '@utils/form-utils';
import { FormErrorLabelComponent } from "../../../../shared/components/form-error-label/form-error-label.component";
import { ProductsService } from '@products/services/products.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

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

    isLoading = signal(false);
    wasSaved = signal(false);

    hasError = signal(false);
    errorMessage = signal('');

    imageFileList: FileList | undefined = undefined;
    tempImages = signal<string[]>([]);

    imagesToCarousel = computed(() => {
        const images = [...this.product().images, ...this.tempImages()];
        return images;
    })

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

    async onSubmit() {
        this.isLoading.set(true);
        const formValue = this.productForm.value;
        const productLike: Partial<Product> = {
            ...(formValue as any),
            tags: formValue.tags?.toLowerCase().split(',').map(tag => tag.trim()) ?? [],
        }
        try {
            if (this.product().id === 'new') {
                const product = await firstValueFrom(
                    this._productsService.createProduct(productLike, this.imageFileList)
                );
                this.showSavedMessage(2000, true, product.id);
            } else {
                await firstValueFrom(
                    this._productsService.updateProduct(this.product().id, productLike, this.imageFileList)
                );
                this.showSavedMessage(2000, false);
            }
        } catch (error: any) {
            this.isLoading.set(false);
            this.errorMessage.set(error.error.message[0]);
            this.hasError.set(true);
            setTimeout(() => {
                this.hasError.set(false);
            }, 2000);
        }
    }

    onFilesChanged(fileList: FileList | null) {
        this.imageFileList = fileList ?? undefined;
        const imagesUrls = Array.from(fileList ?? []).map(file => {
            return URL.createObjectURL(file);
        });
        this.tempImages.set(imagesUrls);
    }

    async showSavedMessage(durationMs = 2000, redirect: boolean, id?: string) {
        this.isLoading.set(false);
        this.wasSaved.set(true);
        if (redirect) {
            await new Promise(resolve => setTimeout(resolve, durationMs));
            this.wasSaved.set(false);
            this._router.navigate(['/admin/product/', id]);
        } else {
            setTimeout(() => {
                this.wasSaved.set(false);
            }, durationMs);
        }
    }
}
