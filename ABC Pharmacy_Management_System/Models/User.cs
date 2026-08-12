namespace ABC_Pharmacy_Management_System.Models
{
    public class User
    {
        public int Id { get; set; }

        public string Username { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string PasswordHash { get; set; } = string.Empty;

        public string Role { get; set; } = "User";

        public string? Token { get; set; }

        public DateTime RegisteredAt { get; set; } = DateTime.UtcNow;
    }
}