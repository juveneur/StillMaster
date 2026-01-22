namespace StillMaster.Application.DTOs;

public class StockDto
{
    public int Id { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string ProductType { get; set; } = string.Empty;
    public string? BatchNumber { get; set; }
    public decimal QuantityInStock { get; set; }
    public string UnitOfMeasure { get; set; } = string.Empty;
    public decimal AlcoholByVolume { get; set; }
    public DateTime? DistillationDate { get; set; }
    public DateTime? BottlingDate { get; set; }
    public int? AgingPeriodMonths { get; set; }
    public string? BarrelType { get; set; }
    public decimal UnitPrice { get; set; }
    public string Location { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public string CreatedBy { get; set; } = string.Empty;
}

public class CreateStockRequest
{
    public string ProductName { get; set; } = string.Empty;
    public string ProductType { get; set; } = string.Empty;
    public string? BatchNumber { get; set; }
    public decimal QuantityInStock { get; set; }
    public string UnitOfMeasure { get; set; } = string.Empty;
    public decimal AlcoholByVolume { get; set; }
    public DateTime? DistillationDate { get; set; }
    public DateTime? BottlingDate { get; set; }
    public int? AgingPeriodMonths { get; set; }
    public string? BarrelType { get; set; }
    public decimal UnitPrice { get; set; }
    public string Location { get; set; } = string.Empty;
}

public class UpdateStockRequest
{
    public string ProductName { get; set; } = string.Empty;
    public string ProductType { get; set; } = string.Empty;
    public string? BatchNumber { get; set; }
    public decimal QuantityInStock { get; set; }
    public string UnitOfMeasure { get; set; } = string.Empty;
    public decimal AlcoholByVolume { get; set; }
    public DateTime? DistillationDate { get; set; }
    public DateTime? BottlingDate { get; set; }
    public int? AgingPeriodMonths { get; set; }
    public string? BarrelType { get; set; }
    public decimal UnitPrice { get; set; }
    public string Location { get; set; } = string.Empty;
}

