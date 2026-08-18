using ABC_Pharmacy_Management_System.IServices;
using ABC_Pharmacy_Management_System.Models;
using System.Text.Json;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Logging;

namespace ABC_Pharmacy_Management_System.Services
{
    public class MedicineService : IMedicineService
    {
        private readonly string _filePath;
        private readonly JsonSerializerOptions _jsonOptions;
        private readonly ILogger<MedicineService> _logger;

        public MedicineService(IWebHostEnvironment env, ILogger<MedicineService> logger)
        {
            _logger = logger;
            _filePath = Path.Combine(env.ContentRootPath, "Data", "medicines.json");
            
            _logger.LogInformation($"Medicine file path: {_filePath}");
            _logger.LogInformation($"File exists: {File.Exists(_filePath)}");

            _jsonOptions = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
                WriteIndented = true
            };
        }

        public List<Medicine> GetAllMedicines()
        {
            if (!File.Exists(_filePath))
            {
                _logger.LogWarning($"Medicine file not found at {_filePath}");
                return new List<Medicine>();
            }

            var json = File.ReadAllText(_filePath);
            _logger.LogInformation($"Read JSON: {json.Substring(0, Math.Min(100, json.Length))}...");

            if (string.IsNullOrWhiteSpace(json))
                return new List<Medicine>();

            try
            {
                var medicines = JsonSerializer.Deserialize<List<Medicine>>(json, _jsonOptions) 
                       ?? new List<Medicine>();
                _logger.LogInformation($"Successfully deserialized {medicines.Count} medicines");
                return medicines;
            }
            catch (JsonException ex)
            {
                _logger.LogError($"JSON Deserialization error: {ex.Message}");
                try
                {
                    var single = JsonSerializer.Deserialize<Medicine>(json, _jsonOptions);
                    if (single != null)
                        return new List<Medicine> { single };
                }
                catch
                {
                    _logger.LogError("Failed to deserialize as single object");
                }
                return new List<Medicine>();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Unexpected error: {ex.Message}");
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
            medicine.Id = medicines.Count == 0 ? 1 : medicines.Max(x => x.Id) + 1;
            medicines.Add(medicine);

            var json = JsonSerializer.Serialize(medicines, _jsonOptions);
            var dir = Path.GetDirectoryName(_filePath);
            
            if (!string.IsNullOrEmpty(dir) && !Directory.Exists(dir))
                Directory.CreateDirectory(dir);

            File.WriteAllText(_filePath, json);
            _logger.LogInformation($"Added medicine. Total count: {medicines.Count}");
        }

        public List<Medicine> SearchMedicine(string name)
        {
            return GetAllMedicines()
                .Where(x => x.FullName.Contains(name ?? string.Empty, StringComparison.OrdinalIgnoreCase))
                .ToList();
        }
    }
}