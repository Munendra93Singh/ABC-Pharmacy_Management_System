ABC Pharmacy_Management_System\IServices\IAuthService.cs
using ABC_Pharmacy_Management_System.Models;

namespace ABC_Pharmacy_Management_System.IServices
{
    public interface IAuthService
    {
        Task<string?> LoginAsync(string username, string password);
        Task RegisterAsync(User user, string password);
        User? GetUserByUsername(string username);
    }
}