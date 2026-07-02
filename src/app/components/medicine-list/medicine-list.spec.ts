import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicineList } from './medicine-list';

describe('MedicineList', () => {
  let component: MedicineList;
  let fixture: ComponentFixture<MedicineList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicineList]
    }).compileComponents();

    fixture = TestBed.createComponent(MedicineList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter medicines by name', () => {
    component.searchTerm = 'paracetamol';
    expect(component.filteredMedicines.length).toBe(1);
    expect(component.filteredMedicines[0].name).toBe('Paracetamol');
  });
});
