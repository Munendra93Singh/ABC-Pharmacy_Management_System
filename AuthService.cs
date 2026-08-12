ABC Pharmacy_Management_System\Services\AuthService.cs
using ABC_Pharmacy_Management_System.IServices;
using ABC_Pharmacy_Management_System.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Cryptography;
using System.Text;

namespace ABC_Pharmacy_Management_System.Services
{
    public class AuthService : IAuthService
    {
        private readonly IConfiguration _configuration;
        private readonly List<User> _users = new(); // In-memory storage (replace with DB)

        public AuthService(IConfiguration configuration)
        {
            _configuration = configuration;
            // Seed sample users for testing
            _users.Add(new User
            {
                Id = 1,
                Username = "admin",
                Email = "admin@pharmacy.com",
                PasswordHash = HashPassword("admin123"),
                Role = "Admin"
            });
            _users.Add(new User
            {
                Id = 2,
                Username = "user",
                Email = "user@pharmacy.com",
                PasswordHash = HashPassword("user123"),
                Role = "User"
            });
        }

        public async Task<string?> LoginAsync(string username, string password)
        {
            var user = GetUserByUsername(username);
            if (user == null || !VerifyPassword(password, user.PasswordHash))
                return null;

            return GenerateJwtToken(user);
        }

        public async Task RegisterAsync(User user, string password)
        {
            if (GetUserByUsername(user.Username) != null)
                throw new InvalidOperationException("User already exists.");

            user.Id = _users.Count + 1;
            user.PasswordHash = HashPassword(password);
            _users.Add(user);

            await Task.CompletedTask;
        }

        public User? GetUserByUsername(string username)
        {
            return _users.FirstOrDefault(u => u.Username.Equals(username, StringComparison.OrdinalIgnoreCase));
        }

        private string GenerateJwtToken(User user)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["SecretKey"]!));
            var signingCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: new[]
                {
                    new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.Name, user.Username),
                    new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.Email, user.Email),
                    new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.Role, user.Role)
                },
                expires: DateTime.UtcNow.AddHours(int.Parse(jwtSettings["ExpiresInHours"]!)),
                signingCredentials: signingCredentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(hashedBytes);
            }
        }

        private bool VerifyPassword(string password, string hash)
        {
            var hashOfInput = Convert.ToBase64String(SHA256.Create().ComputeHash(Encoding.UTF8.GetBytes(password)));
            return hashOfInput.Equals(hash);
        }
    }
}