using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using StillMaster.Core.Entities;

namespace StillMaster.Infrastructure.Data;

public static class DbInitializer
{
    public static async Task SeedDataAsync(ApplicationDbContext context, UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
    {
        // Ensure database is created
        await context.Database.EnsureCreatedAsync();

        // Seed roles
        if (!await roleManager.RoleExistsAsync("Admin"))
        {
            await roleManager.CreateAsync(new IdentityRole("Admin"));
        }

        if (!await roleManager.RoleExistsAsync("User"))
        {
            await roleManager.CreateAsync(new IdentityRole("User"));
        }

        // Seed admin user
        var adminEmail = "admin@stillmaster.com";
        var adminUser = await userManager.FindByEmailAsync(adminEmail);

        if (adminUser == null)
        {
            adminUser = new ApplicationUser
            {
                UserName = adminEmail,
                Email = adminEmail,
                FirstName = "Admin",
                LastName = "User",
                EmailConfirmed = true,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            var result = await userManager.CreateAsync(adminUser, "Admin123!");

            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(adminUser, "Admin");
            }
        }

        // Seed sample data if needed
        if (!await context.Ingredients.AnyAsync())
        {
            var ingredients = new List<Ingredient>
            {
                new Ingredient
                {
                    Name = "Barley",
                    Description = "Malted barley for whiskey production",
                    UnitOfMeasure = "kg",
                    CurrentStock = 500,
                    ReorderLevel = 100,
                    UnitCost = 2.50m,
                    Supplier = "Grain Suppliers Inc",
                    CreatedBy = adminEmail,
                    CreatedAt = DateTime.UtcNow
                },
                new Ingredient
                {
                    Name = "Yeast",
                    Description = "Distiller's yeast",
                    UnitOfMeasure = "kg",
                    CurrentStock = 50,
                    ReorderLevel = 10,
                    UnitCost = 15.00m,
                    Supplier = "Yeast Co",
                    CreatedBy = adminEmail,
                    CreatedAt = DateTime.UtcNow
                },
                new Ingredient
                {
                    Name = "Water",
                    Description = "Filtered spring water",
                    UnitOfMeasure = "liters",
                    CurrentStock = 10000,
                    ReorderLevel = 2000,
                    UnitCost = 0.10m,
                    CreatedBy = adminEmail,
                    CreatedAt = DateTime.UtcNow
                }
            };

            await context.Ingredients.AddRangeAsync(ingredients);
            await context.SaveChangesAsync();
        }

        if (!await context.Stocks.AnyAsync())
        {
            var stocks = new List<Stock>
            {
                // Micil Distillery Products
                new Stock
                {
                    ProductName = "Micil Long Walk",
                    ProductType = "Whiskey",
                    BatchNumber = "BATCH-2025-001",
                    QuantityInStock = 50,
                    UnitOfMeasure = "bottles",
                    AlcoholByVolume = 43.0m,
                    UnitPrice = 39.00m,
                    Location = "Warehouse A-1",
                    CreatedBy = adminEmail,
                    CreatedAt = DateTime.UtcNow
                },
                new Stock
                {
                    ProductName = "Micil Earls Island",
                    ProductType = "Whiskey",
                    BatchNumber = "BATCH-2025-002",
                    QuantityInStock = 35,
                    UnitOfMeasure = "bottles",
                    AlcoholByVolume = 46.0m,
                    UnitPrice = 55.00m,
                    Location = "Warehouse A-1",
                    CreatedBy = adminEmail,
                    CreatedAt = DateTime.UtcNow
                },
                new Stock
                {
                    ProductName = "Micil Madeira Island",
                    ProductType = "Whiskey",
                    BatchNumber = "BATCH-2025-003",
                    QuantityInStock = 30,
                    UnitOfMeasure = "bottles",
                    AlcoholByVolume = 46.0m,
                    UnitPrice = 55.00m,
                    Location = "Warehouse A-1",
                    CreatedBy = adminEmail,
                    CreatedAt = DateTime.UtcNow
                },
                new Stock
                {
                    ProductName = "Micil Inverin Small Batch",
                    ProductType = "Whiskey",
                    BatchNumber = "BATCH-2025-004",
                    QuantityInStock = 40,
                    UnitOfMeasure = "bottles",
                    AlcoholByVolume = 46.0m,
                    UnitPrice = 45.00m,
                    Location = "Warehouse A-1",
                    CreatedBy = adminEmail,
                    CreatedAt = DateTime.UtcNow
                },
                new Stock
                {
                    ProductName = "Micil Heritage Poitín",
                    ProductType = "Poitín",
                    BatchNumber = "BATCH-2025-005",
                    QuantityInStock = 25,
                    UnitOfMeasure = "bottles",
                    AlcoholByVolume = 46.0m,
                    UnitPrice = 55.00m,
                    Location = "Warehouse A-2",
                    CreatedBy = adminEmail,
                    CreatedAt = DateTime.UtcNow
                },
                new Stock
                {
                    ProductName = "Micil Irish Poitín",
                    ProductType = "Poitín",
                    BatchNumber = "BATCH-2025-006",
                    QuantityInStock = 45,
                    UnitOfMeasure = "bottles",
                    AlcoholByVolume = 44.0m,
                    UnitPrice = 38.00m,
                    Location = "Warehouse A-2",
                    CreatedBy = adminEmail,
                    CreatedAt = DateTime.UtcNow
                },
                new Stock
                {
                    ProductName = "Micil Irish Cream",
                    ProductType = "Cream",
                    BatchNumber = "BATCH-2025-007",
                    QuantityInStock = 60,
                    UnitOfMeasure = "bottles",
                    AlcoholByVolume = 17.0m,
                    UnitPrice = 29.00m,
                    Location = "Warehouse A-3",
                    CreatedBy = adminEmail,
                    CreatedAt = DateTime.UtcNow
                },
                new Stock
                {
                    ProductName = "Micil Irish Gin",
                    ProductType = "Gin",
                    BatchNumber = "BATCH-2025-008",
                    QuantityInStock = 55,
                    UnitOfMeasure = "bottles",
                    AlcoholByVolume = 42.0m,
                    UnitPrice = 42.00m,
                    Location = "Warehouse A-4",
                    CreatedBy = adminEmail,
                    CreatedAt = DateTime.UtcNow
                },
                new Stock
                {
                    ProductName = "Micil Spiced Orange Gin",
                    ProductType = "Gin",
                    BatchNumber = "BATCH-2025-009",
                    QuantityInStock = 50,
                    UnitOfMeasure = "bottles",
                    AlcoholByVolume = 42.0m,
                    UnitPrice = 42.00m,
                    Location = "Warehouse A-4",
                    CreatedBy = adminEmail,
                    CreatedAt = DateTime.UtcNow
                },
                new Stock
                {
                    ProductName = "Range Pack (4 Bottles)",
                    ProductType = "Whiskey",
                    BatchNumber = "PACK-2025-001",
                    QuantityInStock = 20,
                    UnitOfMeasure = "packs",
                    AlcoholByVolume = 44.0m,
                    UnitPrice = 155.00m,
                    Location = "Warehouse B-1",
                    CreatedBy = adminEmail,
                    CreatedAt = DateTime.UtcNow
                },
                new Stock
                {
                    ProductName = "Gin Pack (2 Bottles)",
                    ProductType = "Gin",
                    BatchNumber = "PACK-2025-002",
                    QuantityInStock = 25,
                    UnitOfMeasure = "packs",
                    AlcoholByVolume = 42.0m,
                    UnitPrice = 79.00m,
                    Location = "Warehouse B-1",
                    CreatedBy = adminEmail,
                    CreatedAt = DateTime.UtcNow
                },
                new Stock
                {
                    ProductName = "Poitín Pack (2 Bottles)",
                    ProductType = "Poitín",
                    BatchNumber = "PACK-2025-003",
                    QuantityInStock = 15,
                    UnitOfMeasure = "packs",
                    AlcoholByVolume = 45.0m,
                    UnitPrice = 87.00m,
                    Location = "Warehouse B-1",
                    CreatedBy = adminEmail,
                    CreatedAt = DateTime.UtcNow
                },
                new Stock
                {
                    ProductName = "Whiskey Pack (3 Bottles)",
                    ProductType = "Whiskey",
                    BatchNumber = "PACK-2025-004",
                    QuantityInStock = 18,
                    UnitOfMeasure = "packs",
                    AlcoholByVolume = 45.0m,
                    UnitPrice = 145.00m,
                    Location = "Warehouse B-1",
                    CreatedBy = adminEmail,
                    CreatedAt = DateTime.UtcNow
                }
            };

            await context.Stocks.AddRangeAsync(stocks);
            await context.SaveChangesAsync();
        }

        if (!await context.Customers.AnyAsync())
        {
            var customers = new List<Customer>
            {
                new Customer
                {
                    Name = "Micil Distillery",
                    CompanyName = "Micil Distillery Ltd.",
                    Email = "shop@micil.ie",
                    Phone = "091 450 226",
                    Address = "226 Upper Salthill",
                    City = "Galway",
                    State = "Galway",
                    ZipCode = "H91 N9WK",
                    Country = "Ireland",
                    CustomerType = CustomerType.Retail,
                    LicenseNumber = "DIST-IRE-12345",
                    CreatedBy = adminEmail,
                    CreatedAt = DateTime.UtcNow
                },
                new Customer
                {
                    Name = "John Smith",
                    Email = "john@example.com",
                    Phone = "555-0123",
                    Address = "123 Main St",
                    City = "Dublin",
                    State = "Dublin",
                    ZipCode = "D01 X1Y2",
                    Country = "Ireland",
                    CustomerType = CustomerType.Individual,
                    CreatedBy = adminEmail,
                    CreatedAt = DateTime.UtcNow
                },
                new Customer
                {
                    Name = "Sarah Johnson",
                    CompanyName = "Premium Spirits Wholesale",
                    Email = "sarah@premiumspirits.ie",
                    Phone = "091-555-0456",
                    Address = "456 Commerce Ave",
                    City = "Cork",
                    State = "Cork",
                    ZipCode = "T12 X456",
                    Country = "Ireland",
                    CustomerType = CustomerType.Wholesale,
                    LicenseNumber = "WS-IRE-67890",
                    CreatedBy = adminEmail,
                    CreatedAt = DateTime.UtcNow
                }
            };

            await context.Customers.AddRangeAsync(customers);
            await context.SaveChangesAsync();
        }

        // Seed a sample order
        if (!await context.Orders.AnyAsync())
        {
            var customer = await context.Customers.FirstOrDefaultAsync(c => c.Email == "john@example.com");
            var stocks = await context.Stocks.Take(3).ToListAsync();

            if (customer != null && stocks.Any())
            {
                var orderItems = new List<OrderItem>();
                decimal subtotal = 0;

                // Add 2 bottles of Micil Long Walk
                var stock1 = stocks[0];
                var item1Total = 2 * stock1.UnitPrice;
                orderItems.Add(new OrderItem
                {
                    StockId = stock1.Id,
                    ProductName = stock1.ProductName,
                    Quantity = 2,
                    UnitPrice = stock1.UnitPrice,
                    TotalPrice = item1Total
                });
                subtotal += item1Total;
                stock1.QuantityInStock -= 2;

                // Add 1 bottle of Micil Irish Gin
                if (stocks.Count > 1)
                {
                    var stock2 = stocks[1];
                    var item2Total = 1 * stock2.UnitPrice;
                    orderItems.Add(new OrderItem
                    {
                        StockId = stock2.Id,
                        ProductName = stock2.ProductName,
                        Quantity = 1,
                        UnitPrice = stock2.UnitPrice,
                        TotalPrice = item2Total
                    });
                    subtotal += item2Total;
                    stock2.QuantityInStock -= 1;
                }

                var taxAmount = subtotal * 0.23m; // 23% VAT (Ireland)
                var shippingAmount = 9.99m;
                var totalAmount = subtotal + taxAmount + shippingAmount;

                var order = new Order
                {
                    OrderNumber = $"ORD-{DateTime.UtcNow:yyyyMMdd}-SAMPLE001",
                    CustomerId = customer.Id,
                    OrderDate = DateTime.UtcNow.AddDays(-7),
                    Status = OrderStatus.Delivered,
                    Subtotal = subtotal,
                    TaxAmount = taxAmount,
                    ShippingAmount = shippingAmount,
                    TotalAmount = totalAmount,
                    ShipDate = DateTime.UtcNow.AddDays(-5),
                    TrackingNumber = "IE123456789",
                    ShippingAddress = "123 Main St, Dublin, D01 X1Y2, Ireland",
                    Notes = "Sample order - Customer requested gift wrapping",
                    CreatedBy = adminEmail,
                    CreatedAt = DateTime.UtcNow.AddDays(-7),
                    OrderItems = orderItems
                };

                await context.Orders.AddAsync(order);
                await context.SaveChangesAsync();
            }
        }
    }
}

