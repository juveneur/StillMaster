namespace StillMaster.Core.Entities;

public class Stock
{
    public int Id { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string ProductType { get; set; } = string.Empty; // e.g., Whiskey, Gin, Rum, Vodka
    public string? BatchNumber { get; set; }
    public decimal QuantityInStock { get; set; }
    public string UnitOfMeasure { get; set; } = string.Empty; // e.g., bottles, cases, liters
    public decimal AlcoholByVolume { get; set; } // ABV percentage
    public DateTime? DistillationDate { get; set; }
    public DateTime? BottlingDate { get; set; }
    public int? AgingPeriodMonths { get; set; }
    public string? BarrelType { get; set; }
    public decimal UnitPrice { get; set; }
    public string Location { get; set; } = string.Empty; // Warehouse location
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public string CreatedBy { get; set; } = string.Empty;
}

