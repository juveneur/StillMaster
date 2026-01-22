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
public class OrdersController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public OrdersController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<OrderDto>>> GetAll()
    {
        var orders = await _context.Orders
            .Include(o => o.Customer)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Stock)
            .Select(o => new OrderDto
            {
                Id = o.Id,
                OrderNumber = o.OrderNumber,
                CustomerId = o.CustomerId,
                CustomerName = o.Customer.Name,
                OrderDate = o.OrderDate,
                ShipDate = o.ShipDate,
                Status = o.Status.ToString(),
                Subtotal = o.Subtotal,
                TaxAmount = o.TaxAmount,
                ShippingAmount = o.ShippingAmount,
                TotalAmount = o.TotalAmount,
                Notes = o.Notes,
                ShippingAddress = o.ShippingAddress,
                TrackingNumber = o.TrackingNumber,
                CreatedAt = o.CreatedAt,
                UpdatedAt = o.UpdatedAt,
                CreatedBy = o.CreatedBy,
                OrderItems = o.OrderItems.Select(oi => new OrderItemDto
                {
                    Id = oi.Id,
                    StockId = oi.StockId,
                    ProductName = oi.ProductName,
                    Quantity = oi.Quantity,
                    UnitPrice = oi.UnitPrice,
                    TotalPrice = oi.TotalPrice
                }).ToList()
            })
            .ToListAsync();

        return Ok(orders);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<OrderDto>> GetById(int id)
    {
        var order = await _context.Orders
            .Include(o => o.Customer)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Stock)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order == null)
            return NotFound();

        return Ok(new OrderDto
        {
            Id = order.Id,
            OrderNumber = order.OrderNumber,
            CustomerId = order.CustomerId,
            CustomerName = order.Customer.Name,
            OrderDate = order.OrderDate,
            ShipDate = order.ShipDate,
            Status = order.Status.ToString(),
            Subtotal = order.Subtotal,
            TaxAmount = order.TaxAmount,
            ShippingAmount = order.ShippingAmount,
            TotalAmount = order.TotalAmount,
            Notes = order.Notes,
            ShippingAddress = order.ShippingAddress,
            TrackingNumber = order.TrackingNumber,
            CreatedAt = order.CreatedAt,
            UpdatedAt = order.UpdatedAt,
            CreatedBy = order.CreatedBy,
            OrderItems = order.OrderItems.Select(oi => new OrderItemDto
            {
                Id = oi.Id,
                StockId = oi.StockId,
                ProductName = oi.ProductName,
                Quantity = oi.Quantity,
                UnitPrice = oi.UnitPrice,
                TotalPrice = oi.TotalPrice
            }).ToList()
        });
    }

    [HttpPost]
    public async Task<ActionResult<OrderDto>> Create([FromBody] CreateOrderRequest request)
    {
        var userEmail = User.FindFirst(ClaimTypes.Email)?.Value ?? "unknown";

        // Validate customer exists
        var customer = await _context.Customers.FindAsync(request.CustomerId);
        if (customer == null)
            return BadRequest(new { message = "Customer not found" });

        // Validate stock items and calculate totals
        decimal subtotal = 0;
        var orderItems = new List<OrderItem>();

        foreach (var item in request.OrderItems)
        {
            var stock = await _context.Stocks.FindAsync(item.StockId);
            if (stock == null)
                return BadRequest(new { message = $"Stock item {item.StockId} not found" });

            if (stock.QuantityInStock < item.Quantity)
                return BadRequest(new { message = $"Insufficient stock for {stock.ProductName}" });

            var itemTotal = item.Quantity * stock.UnitPrice;
            subtotal += itemTotal;

            orderItems.Add(new OrderItem
            {
                StockId = item.StockId,
                ProductName = stock.ProductName,
                Quantity = item.Quantity,
                UnitPrice = stock.UnitPrice,
                TotalPrice = itemTotal
            });

            // Reduce stock quantity
            stock.QuantityInStock -= item.Quantity;
            stock.UpdatedAt = DateTime.UtcNow;
        }

        var totalAmount = subtotal + request.TaxAmount + request.ShippingAmount;

        var order = new Order
        {
            OrderNumber = $"ORD-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString().Substring(0, 8).ToUpper()}",
            CustomerId = request.CustomerId,
            OrderDate = request.OrderDate,
            Status = OrderStatus.Pending,
            Subtotal = subtotal,
            TaxAmount = request.TaxAmount,
            ShippingAmount = request.ShippingAmount,
            TotalAmount = totalAmount,
            Notes = request.Notes,
            ShippingAddress = request.ShippingAddress,
            CreatedBy = userEmail,
            CreatedAt = DateTime.UtcNow,
            OrderItems = orderItems
        };

        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = order.Id }, new OrderDto
        {
            Id = order.Id,
            OrderNumber = order.OrderNumber,
            CustomerId = order.CustomerId,
            CustomerName = customer.Name,
            OrderDate = order.OrderDate,
            ShipDate = order.ShipDate,
            Status = order.Status.ToString(),
            Subtotal = order.Subtotal,
            TaxAmount = order.TaxAmount,
            ShippingAmount = order.ShippingAmount,
            TotalAmount = order.TotalAmount,
            Notes = order.Notes,
            ShippingAddress = order.ShippingAddress,
            TrackingNumber = order.TrackingNumber,
            CreatedAt = order.CreatedAt,
            UpdatedAt = order.UpdatedAt,
            CreatedBy = order.CreatedBy,
            OrderItems = order.OrderItems.Select(oi => new OrderItemDto
            {
                Id = oi.Id,
                StockId = oi.StockId,
                ProductName = oi.ProductName,
                Quantity = oi.Quantity,
                UnitPrice = oi.UnitPrice,
                TotalPrice = oi.TotalPrice
            }).ToList()
        });
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> Update(int id, [FromBody] UpdateOrderRequest request)
    {
        var order = await _context.Orders.FindAsync(id);
        if (order == null)
            return NotFound();

        order.ShipDate = request.ShipDate;
        order.Status = request.Status;
        order.Notes = request.Notes;
        order.TrackingNumber = request.TrackingNumber;
        order.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        var order = await _context.Orders
            .Include(o => o.OrderItems)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order == null)
            return NotFound();

        // Only allow deletion of pending orders
        if (order.Status != OrderStatus.Pending && order.Status != OrderStatus.Cancelled)
            return BadRequest(new { message = "Can only delete pending or cancelled orders" });

        // Restore stock quantities for cancelled orders
        if (order.Status == OrderStatus.Pending)
        {
            foreach (var item in order.OrderItems)
            {
                var stock = await _context.Stocks.FindAsync(item.StockId);
                if (stock != null)
                {
                    stock.QuantityInStock += item.Quantity;
                    stock.UpdatedAt = DateTime.UtcNow;
                }
            }
        }

        _context.Orders.Remove(order);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}

