import { Injectable, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GetProductByIdQueryDto } from '../../../../api-services/products/products-api.models';

@Injectable()
export class ProductFormService {
  private fb = inject(FormBuilder);

  /**
   * Kreira formu za proizvod
   * @param product - Postojeći proizvod (za edit) ili null (za add)
   * @param includeDateAdded - Da li da uključi polje za datum dodavanja (true za add, false za edit)
   */
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
      categoryEntityId: [
        product?.categoryEntityId ?? null,
        [Validators.required]
      ],
      brandEntityId: [
        product?.brandEntityId ?? null,
        [Validators.required]
      ],
      storeEntityId: [
        product?.storeEntityId ?? null,
        [Validators.required]
      ],
      branchEntityId: [
        product?.branchEntityId ?? null,
        [Validators.required]
      ]
    };

    // Dodaj polje za datum samo u add modu
    if (includeDateAdded) {
      controls['dateAdded'] = [
        product?.dateAdded ? new Date(product.dateAdded) : new Date(),
        [Validators.required]
      ];
    }

    return this.fb.group(controls);
  }

  /**
   * Vraća prikladnu poruku greške za dato polje
   */
  getErrorMessage(form: FormGroup, controlName: string): string {
    const control = form.get(controlName);

    if (!control) {
      return '';
    }

    // Ne prikazuj grešku ako polje nije touched
    if (!control.touched && !control.dirty) {
      return '';
    }

    if (!control.errors) {
      return '';
    }

    const errors = control.errors;

    // Prevedene poruke za validacione greške
    if (errors['required']) {
      return this.getRequiredMessage(controlName);
    }

    if (errors['maxlength']) {
      const maxLength = errors['maxlength'].requiredLength;
      return `Maksimalno ${maxLength} karaktera dozvoljeno`;
    }

    if (errors['minlength']) {
      const minLength = errors['minlength'].requiredLength;
      return `Minimalno ${minLength} karaktera potrebno`;
    }

    if (errors['email']) {
      return 'Unesite validnu email adresu';
    }

    if (errors['pattern']) {
      return 'Format nije validan';
    }

    if (errors['min']) {
      return `Minimalna vrijednost je ${errors['min'].min}`;
    }

    if (errors['max']) {
      return `Maksimalna vrijednost je ${errors['max'].max}`;
    }

    return 'Nevažeća vrijednost';
  }

  /**
   * Vraća specifičnu poruku za required validaciju zavisno od polja
   */
  private getRequiredMessage(controlName: string): string {
    const messages: Record<string, string> = {
      'name': 'Naziv proizvoda je obavezan',
      'description': 'Opis proizvoda je obavezan',
      'imageURL': 'URL slike je obavezan',
      'categoryEntityId': 'Kategorija je obavezna',
      'brandEntityId': 'Brend je obavezan',
      'storeEntityId': 'Prodavnica je obavezna',
      'branchEntityId': 'Poslovnica je obavezna',
      'dateAdded': 'Datum dodavanja je obavezan'
    };

    return messages[controlName] || 'Ovo polje je obavezno';
  }

  /**
   * Provjerava da li je cijela forma validna i vraća detalje
   */
  validateForm(form: FormGroup): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (form.invalid) {
      Object.keys(form.controls).forEach(key => {
        const control = form.get(key);
        if (control && control.invalid) {
          const errorMessage = this.getErrorMessage(form, key);
          if (errorMessage) {
            errors.push(errorMessage);
          }
        }
      });
    }

    return {
      valid: form.valid,
      errors: errors
    };
  }

  /**
   * Markiraj sva polja kao touched da se prikažu validacione greške
   */
  markAllAsTouched(form: FormGroup): void {
    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);
      control?.markAsTouched();
      control?.markAsDirty();
    });
  }
}
