using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StillMaster.Application.DTOs;
using StillMaster.Core.Entities;
using StillMaster.Infrastructure.Data;

namespace StillMaster.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class StocksController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public StocksController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<StockDto>>> GetAll()
    {
        var stocks = await _context.Stocks
            .Select(s => new StockDto
            {
                Id = s.Id,
                ProductName = s.ProductName,
                ProductType = s.ProductType,
                BatchNumber = s.BatchNumber,
                QuantityInStock = s.QuantityInStock,
                UnitOfMeasure = s.UnitOfMeasure,
                AlcoholByVolume = s.AlcoholByVolume,
                DistillationDate = s.DistillationDate,
                BottlingDate = s.BottlingDate,
                AgingPeriodMonths = s.AgingPeriodMonths,
                BarrelType = s.BarrelType,
                UnitPrice = s.UnitPrice,
                Location = s.Location,
                CreatedAt = s.CreatedAt,
                UpdatedAt = s.UpdatedAt,
                CreatedBy = s.CreatedBy
            })
            .ToListAsync();

        return Ok(stocks);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<StockDto>> GetById(int id)
    {
        var stock = await _context.Stocks.FindAsync(id);
        if (stock == null)
            return NotFound();

        return Ok(new StockDto
        {
            Id = stock.Id,
            ProductName = stock.ProductName,
            ProductType = stock.ProductType,
            BatchNumber = stock.BatchNumber,
            QuantityInStock = stock.QuantityInStock,
            UnitOfMeasure = stock.UnitOfMeasure,
            AlcoholByVolume = stock.AlcoholByVolume,
            DistillationDate = stock.DistillationDate,
            BottlingDate = stock.BottlingDate,
            AgingPeriodMonths = stock.AgingPeriodMonths,
            BarrelType = stock.BarrelType,
            UnitPrice = stock.UnitPrice,
            Location = stock.Location,
            CreatedAt = stock.CreatedAt,
            UpdatedAt = stock.UpdatedAt,
            CreatedBy = stock.CreatedBy
        });
    }

    [HttpPost]
    public async Task<ActionResult<StockDto>> Create([FromBody] CreateStockRequest request)
    {
        var userEmail = User.FindFirst(ClaimTypes.Email)?.Value ?? "unknown";

        var stock = new Stock
        {
            ProductName = request.ProductName,
            ProductType = request.ProductType,
            BatchNumber = request.BatchNumber,
            QuantityInStock = request.QuantityInStock,
            UnitOfMeasure = request.UnitOfMeasure,
            AlcoholByVolume = request.AlcoholByVolume,
            DistillationDate = request.DistillationDate,
            BottlingDate = request.BottlingDate,
            AgingPeriodMonths = request.AgingPeriodMonths,
            BarrelType = request.BarrelType,
            UnitPrice = request.UnitPrice,
            Location = request.Location,
            CreatedBy = userEmail,
            CreatedAt = DateTime.UtcNow
        };

        _context.Stocks.Add(stock);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = stock.Id }, new StockDto
        {
            Id = stock.Id,
            ProductName = stock.ProductName,
            ProductType = stock.ProductType,
            BatchNumber = stock.BatchNumber,
            QuantityInStock = stock.QuantityInStock,
            UnitOfMeasure = stock.UnitOfMeasure,
            AlcoholByVolume = stock.AlcoholByVolume,
            DistillationDate = stock.DistillationDate,
            BottlingDate = stock.BottlingDate,
            AgingPeriodMonths = stock.AgingPeriodMonths,
            BarrelType = stock.BarrelType,
            UnitPrice = stock.UnitPrice,
            Location = stock.Location,
            CreatedAt = stock.CreatedAt,
            UpdatedAt = stock.UpdatedAt,
            CreatedBy = stock.CreatedBy
        });
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> Update(int id, [FromBody] UpdateStockRequest request)
    {
        var stock = await _context.Stocks.FindAsync(id);
        if (stock == null)
            return NotFound();

        stock.ProductName = request.ProductName;
        stock.ProductType = request.ProductType;
        stock.BatchNumber = request.BatchNumber;
        stock.QuantityInStock = request.QuantityInStock;
        stock.UnitOfMeasure = request.UnitOfMeasure;
        stock.AlcoholByVolume = request.AlcoholByVolume;
        stock.DistillationDate = request.DistillationDate;
        stock.BottlingDate = request.BottlingDate;
        stock.AgingPeriodMonths = request.AgingPeriodMonths;
        stock.BarrelType = request.BarrelType;
        stock.UnitPrice = request.UnitPrice;
        stock.Location = request.Location;
        stock.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        var stock = await _context.Stocks.FindAsync(id);
        if (stock == null)
            return NotFound();

        _context.Stocks.Remove(stock);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}

