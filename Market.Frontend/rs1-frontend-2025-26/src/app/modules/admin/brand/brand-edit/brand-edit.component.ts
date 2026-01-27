// brand-edit.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BrandFormService } from '../services/brand-form.service';

@Component({
  selector: 'app-brand-edit',
  templateUrl: './brand-edit.component.html',
  styleUrls: ['./brand-edit.component.scss']
})
export class BrandEditComponent implements OnInit {
  form: FormGroup;
  isSaving = false;
  brandId: number;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private brandService: BrandFormService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });
    this.brandId = 0;
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.brandId = +params['id'];
        this.loadBrandData(this.brandId);
      }
    });
  }

  loadBrandData(id: number): void {
    this.brandService.getBrandById(id).subscribe({
      next: (brand) => {
        this.form.patchValue({
          name: brand.name,
          description: brand.description
        });
      },
      error: (error) => {
        alert('Greška pri učitavanju brenda');
        this.goBack();
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }

    this.isSaving = true;
    const formData = this.form.value;

    this.brandService.updateBrand(this.brandId, formData).subscribe({
      next: () => {
        this.isSaving = false;
        this.goBack();
      },
      error: (error) => {
        this.isSaving = false;
        alert('Greška pri ažuriranju brenda');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/brand']);
  }
}
