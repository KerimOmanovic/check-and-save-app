// brand-add.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BrandFormService } from '../services/brand-form.service';

@Component({
  selector: 'app-brand-add',
  templateUrl: './brand-add.component.html',
  styleUrls: ['./brand-add.component.scss']
})
export class BrandAddComponent implements OnInit {
  form: FormGroup;
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private brandService: BrandFormService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {}

  submit(): void {
    if (this.form.invalid) {
      return;
    }

    this.isSaving = true;
    const formData = this.form.value;

    this.brandService.createBrand(formData).subscribe({
      next: () => {
        this.isSaving = false;
        this.goBack();
      },
      error: (error) => {
        this.isSaving = false;
        alert('Greška pri kreiranju brenda');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/brand']);
  }
}
