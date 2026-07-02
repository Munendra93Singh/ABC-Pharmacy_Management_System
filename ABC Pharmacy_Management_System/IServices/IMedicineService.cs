using ABC_Pharmacy_Management_System.Models;

namespace ABC_Pharmacy_Management_System.IServices
{
    public interface IMedicineService
    {
        List<Medicine> GetAllMedicines();
        Medicine? GetMedicineById(int id);
        void AddMedicine(Medicine medicine);
        List<Medicine> SearchMedicine(string name);
    }
}
