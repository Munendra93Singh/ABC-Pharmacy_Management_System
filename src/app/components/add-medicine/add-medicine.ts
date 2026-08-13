import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MedicineService } from '../../Services/MedicineService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-medicine',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-medicine.html',
  styleUrl: './add-medicine.css',
})

export class AddMedicine {
  errorMessage = '';
  successMessage = '';
  isSubmitting = false;
  addMedicineForm!: FormGroup;

  constructor(
    private medicineService: MedicineService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.initializeForm();
  }

  initializeForm(): void {

    this.addMedicineForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      brand: ['', [Validators.required, Validators.minLength(2)]],
      notes: ['', Validators.minLength(3)],
      quantity: ['', [Validators.required, Validators.min(1)]],
      price: ['', [Validators.required, Validators.min(0.01)]],
      expiryDate: ['', Validators.required]
    });

  }

  onAddMedicine(): void {
    if (this.addMedicineForm.invalid) {
      this.errorMessage = 'Please fill all required fields correctly';
      return;
    }

    this.isSubmitting = true;

    this.medicineService.addmedicine(this.addMedicineForm.value).subscribe({

      next: () => {

        this.successMessage = 'Medicine added successfully!';
        this.addMedicineForm.reset();
        this.isSubmitting = false;

        this.router.navigate(['/medicine-list']);
      },

      error: (err) => {

        this.errorMessage =
          err.error?.message || 'Failed to add medicine.';
        this.isSubmitting = false;
      }

    });

  }

  get fullName() { return this.addMedicineForm.get('fullName'); }
  get brand() { return this.addMedicineForm.get('brand'); }
  get notes() { return this.addMedicineForm.get('notes'); }
  get quantity() { return this.addMedicineForm.get('quantity'); }
  get price() { return this.addMedicineForm.get('price'); }
  get expiryDate() { return this.addMedicineForm.get('expiryDate'); }

}