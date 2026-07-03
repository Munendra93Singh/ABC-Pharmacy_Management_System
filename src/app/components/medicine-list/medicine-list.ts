import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
  selectedFilter: 'all' | 'lowStock' | 'expiringSoon' | 'active' = 'all';
  medicines: Medicine[] = [];
  loading = true;
  errorMessage = '';

  constructor(
    private medicineService: MedicineService,
   private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadMedicines();
  }

  loadMedicines(): void {
    this.medicineService.getmedicine().subscribe({
      next: (data: Medicine[]) => {

        this.medicines = data.map((medicine) => ({
          ...medicine,
          formattedExpiry: new Date(
            medicine.expiryDate
          ).toLocaleDateString(),
        }));

        this.loading = false;
          this.cdr.detectChanges();
      },

      error: () => {
        this.errorMessage =
          'Unable to load medicines. Please try again later.';

        this.loading = false;
      },
    });
  }

  filterMedicines(
    filter: 'all' | 'lowStock' | 'expiringSoon' | 'active'
  ): void {
    this.selectedFilter = filter;
  }

  get filteredMedicines(): Medicine[] {

    let filtered = [...this.medicines];

    // Search Filter

    const term = this.searchTerm.trim().toLowerCase();

    if (term) {

      filtered = filtered.filter((medicine) => {

        const medicineName = (
          medicine.fullName ||
          medicine.name ||
          ''
        ).toLowerCase();

        return medicineName.includes(term);

      });

    }

    // Summary Filter

    switch (this.selectedFilter) {

      case 'lowStock':

        filtered = filtered.filter(
          (medicine) => medicine.quantity < 10
        );

        break;

      case 'expiringSoon':

        filtered = filtered.filter(
          (medicine) =>
            this.getDaysUntilExpiry(
              medicine.expiryDate
            ) < 30
        );

        break;

      case 'active':

        filtered = filtered.filter(
          (medicine) =>
            medicine.quantity >= 10 &&
            this.getDaysUntilExpiry(
              medicine.expiryDate
            ) >= 30
        );

        break;

      default:
        break;
    }

    return filtered;
  }

  get lowStockCount(): number {

    return this.medicines.filter(
      (medicine) => medicine.quantity < 10
    ).length;

  }

  get expiringSoonCount(): number {

    return this.medicines.filter(
      (medicine) =>
        this.getDaysUntilExpiry(
          medicine.expiryDate
        ) < 30
    ).length;

  }

  get activeCount(): number {

    return this.medicines.filter((medicine) => {

      return (
        medicine.quantity >= 10 &&
        this.getDaysUntilExpiry(
          medicine.expiryDate
        ) >= 30
      );

    }).length;

  }

  getDaysUntilExpiry(expiryDate: string): number {

    const today = new Date();

    const expiry = new Date(expiryDate);

    return Math.ceil(
      (expiry.getTime() - today.getTime()) /
      (1000 * 60 * 60 * 24)
    );

  }

  getStatusClass(medicine: Medicine): string {

    const days = this.getDaysUntilExpiry(
      medicine.expiryDate
    );

    if (days < 30 && medicine.quantity < 10) {
      return 'warning-both';
    }

    if (days < 30) {
      return 'warning-expiry';
    }

    if (medicine.quantity < 10) {
      return 'warning-stock';
    }

    return 'active';

  }

  getStatusLabel(medicine: Medicine): string {

    const days = this.getDaysUntilExpiry(
      medicine.expiryDate
    );

    if (days < 30 && medicine.quantity < 10) {
      return 'CRITICAL';
    }

    if (days < 30) {
      return 'EXPIRING SOON';
    }

    if (medicine.quantity < 10) {
      return 'LOW STOCK';
    }

    return 'ACTIVE';

  }

}