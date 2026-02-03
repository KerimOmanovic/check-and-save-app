import { Injectable, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GetProductByIdQueryDto } from '../../../../api-services/products/products-api.models';

@Injectable()
export class ProductFormService {
  private fb = inject(FormBuilder);

  createProductForm(
    product?: GetProductByIdQueryDto,
    includeDateAdded: boolean = true
  ): FormGroup {
    const controls: Record<string, any> = {
      name: [
        product?.name ?? '',
        [Validators.required, Validators.maxLength(200)]
      ],
      description: [
        product?.description ?? '',
        [Validators.required, Validators.maxLength(2000)]
      ],
      imageURL: [
        product?.imageURL ?? '',
        [Validators.required, Validators.maxLength(500)]
      ],
      categoryEntityId: [product?.categoryEntityId ?? null, [Validators.required]],
      brandEntityId: [product?.brandEntityId ?? null, [Validators.required]],
      storeEntityId: [product?.storeEntityId ?? null, [Validators.required]],
      branchEntityId: [product?.branchEntityId ?? null, [Validators.required]]
    };

    if (includeDateAdded) {
      controls['dateAdded'] = [
        product?.dateAdded ?? new Date(),
        [Validators.required]
      ];
    }

    return this.fb.group(controls);
  }

  getErrorMessage(form: FormGroup, controlName: string): string {
    const control = form.get(controlName);
    if (!control || !control.errors || !control.touched) {
      return '';
    }

    const errors = control.errors;

    if (errors['required']) {
      return 'This field is required';
    }
    if (errors['maxlength']) {
      return `Maximum ${errors['maxlength'].requiredLength} characters allowed`;
    }

    return 'Invalid value';
  }
}
