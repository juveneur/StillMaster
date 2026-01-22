using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using StillMaster.Core.Entities;

namespace StillMaster.Infrastructure.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Ingredient> Ingredients => Set<Ingredient>();
    public DbSet<Stock> Stocks => Set<Stock>();
    public DbSet<Customer> Customers => Set<Customer>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Configure decimal precision for financial fields
        builder.Entity<Ingredient>()
            .Property(i => i.CurrentStock)
            .HasPrecision(18, 2);

        builder.Entity<Ingredient>()
            .Property(i => i.ReorderLevel)
            .HasPrecision(18, 2);

        builder.Entity<Ingredient>()
            .Property(i => i.UnitCost)
            .HasPrecision(18, 2);

        builder.Entity<Stock>()
            .Property(s => s.QuantityInStock)
            .HasPrecision(18, 2);

        builder.Entity<Stock>()
            .Property(s => s.AlcoholByVolume)
            .HasPrecision(5, 2);

        builder.Entity<Stock>()
            .Property(s => s.UnitPrice)
            .HasPrecision(18, 2);

        builder.Entity<Order>()
            .Property(o => o.Subtotal)
            .HasPrecision(18, 2);

        builder.Entity<Order>()
            .Property(o => o.TaxAmount)
            .HasPrecision(18, 2);

        builder.Entity<Order>()
            .Property(o => o.ShippingAmount)
            .HasPrecision(18, 2);

        builder.Entity<Order>()
            .Property(o => o.TotalAmount)
            .HasPrecision(18, 2);

        builder.Entity<OrderItem>()
            .Property(oi => oi.Quantity)
            .HasPrecision(18, 2);

        builder.Entity<OrderItem>()
            .Property(oi => oi.UnitPrice)
            .HasPrecision(18, 2);

        builder.Entity<OrderItem>()
            .Property(oi => oi.TotalPrice)
            .HasPrecision(18, 2);

        // Configure relationships
        builder.Entity<Order>()
            .HasOne(o => o.Customer)
            .WithMany(c => c.Orders)
            .HasForeignKey(o => o.CustomerId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<OrderItem>()
            .HasOne(oi => oi.Order)
            .WithMany(o => o.OrderItems)
            .HasForeignKey(oi => oi.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<OrderItem>()
            .HasOne(oi => oi.Stock)
            .WithMany()
            .HasForeignKey(oi => oi.StockId)
            .OnDelete(DeleteBehavior.Restrict);

        // Configure indexes
        builder.Entity<Order>()
            .HasIndex(o => o.OrderNumber)
            .IsUnique();

        builder.Entity<Customer>()
            .HasIndex(c => c.Email);

        builder.Entity<Ingredient>()
            .HasIndex(i => i.Name);

        builder.Entity<Stock>()
            .HasIndex(s => s.BatchNumber);
    }
}

