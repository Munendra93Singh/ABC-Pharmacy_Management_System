ABC Pharmacy_Management_System\Models\User.cs
namespace ABC_Pharmacy_Management_System.Models
{
    public class User
    {
        public int Id { get; set; }

        public string Username { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string PasswordHash { get; set; } = string.Empty;

        public string Role { get; set; } = "User"; // e.g., "Admin", "User"
    }
}