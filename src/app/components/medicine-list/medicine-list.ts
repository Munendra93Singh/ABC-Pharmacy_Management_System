import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Medicine {
  id: number;
  name: string;
  category: string;
  quantity: number;
  expiryDate: string;
  price: number;
  supplier: string;
}

@Component({
  selector: 'app-medicine-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './medicine-list.html',
  styleUrl: './medicine-list.css',
})
export class MedicineList {
  searchTerm = '';

  medicines: Medicine[] = [
    { id: 1, name: 'Paracetamol', category: 'Pain Relief', quantity: 25, expiryDate: '2026-10-20', price: 3.5, supplier: 'MediSup' },
    { id: 2, name: 'Amoxicillin', category: 'Antibiotic', quantity: 6, expiryDate: '2026-08-15', price: 8.2, supplier: 'HealthPlus' },
    { id: 3, name: 'Vitamin C', category: 'Supplement', quantity: 40, expiryDate: '2026-07-12', price: 5.8, supplier: 'WellCare' },
    { id: 4, name: 'Ibuprofen', category: 'Pain Relief', quantity: 9, expiryDate: '2026-12-01', price: 4.2, supplier: 'NorthPharm' },
    { id: 5, name: 'Cough Syrup', category: 'Cold & Flu', quantity: 14, expiryDate: '2027-01-25', price: 6.7, supplier: 'CareLab' },
  ];

  get filteredMedicines(): Medicine[] {
    const term = this.searchTerm.trim().toLowerCase();

    if (!term) {
      return this.medicines;
    }

    return this.medicines.filter((medicine) => medicine.name.toLowerCase().includes(term));
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
