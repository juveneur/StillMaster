namespace StillMaster.Core.Entities;

public class Customer
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? CompanyName { get; set; }
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string Address { get; set; } = string.Empty;
    public string? City { get; set; }
    public string? State { get; set; }
    public string? ZipCode { get; set; }
    public string? Country { get; set; }
    public CustomerType CustomerType { get; set; }
    public string? TaxId { get; set; }
    public string? LicenseNumber { get; set; } // For wholesale/retail licenses
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public string CreatedBy { get; set; } = string.Empty;
    
    // Navigation property
    public ICollection<Order> Orders { get; set; } = new List<Order>();
}

public enum CustomerType
{
    Retail,
    Wholesale,
    Distributor,
    Individual
}

