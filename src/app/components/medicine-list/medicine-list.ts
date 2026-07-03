import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MedicineService } from '../../Services/MedicineService';

interface Medicine {
  id: number;
  name?: string;
  fullName?: string;
  category?: string;
  quantity: number;
  expiryDate: string;
  formattedExpiry?: string;
  price: number;
  supplier?: string;
  notes?: string;
  brand?: string;
}

@Component({
  selector: 'app-medicine-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './medicine-list.html',
  styleUrl: './medicine-list.css',
})
export class MedicineList implements OnInit {
  searchTerm = '';
  medicines: Medicine[] = [];
  loading = true;
  errorMessage = '';

  constructor(private medicineService: MedicineService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadMedicines();
  }

  loadMedicines(): void {
    this.medicineService.getmedicine().subscribe({
      next: (data: Medicine[]) => {
        console.log('Medicines loaded:', data);
        this.medicines = data.map((medicine) => ({
          ...medicine,
          formattedExpiry: new Date(medicine.expiryDate).toLocaleDateString(),
        }));
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (error: any) => {
        console.error('Failed to load medicines from API:', error);
        this.errorMessage = 'Unable to load medicines. Please try again later.';
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }

  trackByMedicineId(index: number, medicine: Medicine): number {
    return medicine.id;
  }

  get filteredMedicines(): Medicine[] {
    const term = this.searchTerm.trim().toLowerCase();

    if (!term) {
      return this.medicines;
    }

    return this.medicines.filter((medicine) => {
      const medicineName = (medicine.fullName || medicine.name || '').toLowerCase();
      return medicineName.includes(term);
    });
  }

  get lowStockCount(): number {
    return this.medicines.filter((medicine) => medicine.quantity < 10).length;
  }

  get expiringSoonCount(): number {
    return this.medicines.filter((medicine) => this.getDaysUntilExpiry(medicine.expiryDate) < 30).length;
  }

  get activeCount(): number {
    return this.medicines.filter((medicine) => {
      const daysUntilExpiry = this.getDaysUntilExpiry(medicine.expiryDate);
      return daysUntilExpiry >= 30 && medicine.quantity >= 10;
    }).length;
  }

  getStatusClass(medicine: Medicine): string {
    const today = new Date();
    const expiryDate = new Date(medicine.expiryDate);
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 30 && medicine.quantity < 10) {
      return 'warning-both';
    }

    if (daysUntilExpiry < 30) {
      return 'warning-expiry';
    }

    if (medicine.quantity < 10) {
      return 'warning-stock';
    }

    return 'active';
  }

  getDaysUntilExpiry(expiryDate: string): number {
    const today = new Date();
    const expiry = new Date(expiryDate);
    return Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  }

  getStatusLabel(medicine: Medicine): string {
    const daysUntilExpiry = this.getDaysUntilExpiry(medicine.expiryDate);
    
    if (daysUntilExpiry < 30 && medicine.quantity < 10) {
      return 'CRITICAL';
    }
    if (daysUntilExpiry < 30) {
      return 'EXPIRING SOON';
    }
    if (medicine.quantity < 10) {
      return 'LOW STOCK';
    }
    return 'ACTIVE';
  }
}
