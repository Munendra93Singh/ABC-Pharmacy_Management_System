ABC Pharmacy_Management_System\Controllers\MedicinesController.cs
using ABC_Pharmacy_Management_System.IServices;
using ABC_Pharmacy_Management_System.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ABC_Pharmacy_Management_System.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Protect all endpoints in this controller
    public class MedicinesController : ControllerBase
    {
        private readonly IMedicineService _medicineService;

        public MedicinesController(IMedicineService medicineService)
        {
            _medicineService = medicineService;
        }

        [HttpGet]
        public IActionResult GetAllMedicines()
        {
            var medicines = _medicineService.GetAllMedicines();
            return Ok(medicines);
        }

        [HttpGet("{id}")]
        public IActionResult GetMedicineById(int id)
        {
            var medicine = _medicineService.GetMedicineById(id);
            if (medicine == null)
                return NotFound("Medicine not found.");

            return Ok(medicine);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")] // Only Admin can add medicines
        public IActionResult AddMedicine([FromBody] Medicine medicine)
        {
            _medicineService.AddMedicine(medicine);
            return CreatedAtAction(nameof(GetMedicineById), new { id = medicine.Id }, medicine);
        }

        [HttpGet("search")]
        public IActionResult SearchMedicine(string name)
        {
            var medicines = _medicineService.SearchMedicine(name);
            return Ok(medicines);
        }
    }
}