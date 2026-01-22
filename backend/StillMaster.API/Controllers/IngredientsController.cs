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
public class IngredientsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public IngredientsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<IngredientDto>>> GetAll()
    {
        var ingredients = await _context.Ingredients
            .Select(i => new IngredientDto
            {
                Id = i.Id,
                Name = i.Name,
                Description = i.Description,
                UnitOfMeasure = i.UnitOfMeasure,
                CurrentStock = i.CurrentStock,
                ReorderLevel = i.ReorderLevel,
                UnitCost = i.UnitCost,
                Supplier = i.Supplier,
                CreatedAt = i.CreatedAt,
                UpdatedAt = i.UpdatedAt,
                CreatedBy = i.CreatedBy
            })
            .ToListAsync();

        return Ok(ingredients);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<IngredientDto>> GetById(int id)
    {
        var ingredient = await _context.Ingredients.FindAsync(id);
        if (ingredient == null)
            return NotFound();

        return Ok(new IngredientDto
        {
            Id = ingredient.Id,
            Name = ingredient.Name,
            Description = ingredient.Description,
            UnitOfMeasure = ingredient.UnitOfMeasure,
            CurrentStock = ingredient.CurrentStock,
            ReorderLevel = ingredient.ReorderLevel,
            UnitCost = ingredient.UnitCost,
            Supplier = ingredient.Supplier,
            CreatedAt = ingredient.CreatedAt,
            UpdatedAt = ingredient.UpdatedAt,
            CreatedBy = ingredient.CreatedBy
        });
    }

    [HttpPost]
    public async Task<ActionResult<IngredientDto>> Create([FromBody] CreateIngredientRequest request)
    {
        var userEmail = User.FindFirst(ClaimTypes.Email)?.Value ?? "unknown";

        var ingredient = new Ingredient
        {
            Name = request.Name,
            Description = request.Description,
            UnitOfMeasure = request.UnitOfMeasure,
            CurrentStock = request.CurrentStock,
            ReorderLevel = request.ReorderLevel,
            UnitCost = request.UnitCost,
            Supplier = request.Supplier,
            CreatedBy = userEmail,
            CreatedAt = DateTime.UtcNow
        };

        _context.Ingredients.Add(ingredient);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = ingredient.Id }, new IngredientDto
        {
            Id = ingredient.Id,
            Name = ingredient.Name,
            Description = ingredient.Description,
            UnitOfMeasure = ingredient.UnitOfMeasure,
            CurrentStock = ingredient.CurrentStock,
            ReorderLevel = ingredient.ReorderLevel,
            UnitCost = ingredient.UnitCost,
            Supplier = ingredient.Supplier,
            CreatedAt = ingredient.CreatedAt,
            UpdatedAt = ingredient.UpdatedAt,
            CreatedBy = ingredient.CreatedBy
        });
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> Update(int id, [FromBody] UpdateIngredientRequest request)
    {
        var ingredient = await _context.Ingredients.FindAsync(id);
        if (ingredient == null)
            return NotFound();

        ingredient.Name = request.Name;
        ingredient.Description = request.Description;
        ingredient.UnitOfMeasure = request.UnitOfMeasure;
        ingredient.CurrentStock = request.CurrentStock;
        ingredient.ReorderLevel = request.ReorderLevel;
        ingredient.UnitCost = request.UnitCost;
        ingredient.Supplier = request.Supplier;
        ingredient.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        var ingredient = await _context.Ingredients.FindAsync(id);
        if (ingredient == null)
            return NotFound();

        _context.Ingredients.Remove(ingredient);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}

