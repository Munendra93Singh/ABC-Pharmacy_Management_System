using ABC_Pharmacy_Management_System.IServices;
using ABC_Pharmacy_Management_System.Models;
using System.Text.Json;
using Microsoft.AspNetCore.Hosting;

namespace ABC_Pharmacy_Management_System.Services
{
    public class MedicineService : IMedicineService
    {
        private readonly string _filePath;
        private readonly JsonSerializerOptions _jsonOptions;

        public MedicineService(IWebHostEnvironment env)
        {
            // Resolve the file relative to the app content root
            _filePath = Path.Combine(env.ContentRootPath, "Data", "medicines.json");

            _jsonOptions = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
                WriteIndented = true
            };
        }

        public List<Medicine> GetAllMedicines()
        {
            if (!File.Exists(_filePath))
                return new List<Medicine>();

            var json = File.ReadAllText(_filePath);
            if (string.IsNullOrWhiteSpace(json))
                return new List<Medicine>();

            try
            {
                return JsonSerializer.Deserialize<List<Medicine>>(json, _jsonOptions)
                       ?? new List<Medicine>();
            }
            catch (JsonException)
            {
                // Try to recover: maybe file contains a single Medicine object instead of an array
                try
                {
                    var single = JsonSerializer.Deserialize<Medicine>(json, _jsonOptions);
                    if (single != null)
                        return new List<Medicine> { single };
                }
                catch
                {
                    // ignore and fall through to return empty list
                }

                return new List<Medicine>();
            }
            catch
            {
                // Any other error, return empty list
                return new List<Medicine>();
            }
        }

        public Medicine? GetMedicineById(int id)
        {
            return GetAllMedicines().FirstOrDefault(x => x.Id == id);
        }

        public void AddMedicine(Medicine medicine)
        {
            var medicines = GetAllMedicines();

            medicine.Id = medicines.Count == 0
                ? 1
                : medicines.Max(x => x.Id) + 1;

            medicines.Add(medicine);

            var json = JsonSerializer.Serialize(medicines, _jsonOptions);

            var dir = Path.GetDirectoryName(_filePath);
            if (!string.IsNullOrEmpty(dir) && !Directory.Exists(dir))
                Directory.CreateDirectory(dir);

            File.WriteAllText(_filePath, json);
        }

        public List<Medicine> SearchMedicine(string name)
        {
            return GetAllMedicines()
                .Where(x => x.FullName.Contains(name ?? string.Empty, StringComparison.OrdinalIgnoreCase))
                .ToList();
        }
    }
}
