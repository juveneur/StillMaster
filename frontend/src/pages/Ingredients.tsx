import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ingredientsApi } from '../api/client';
import './SharedList.css';

export default function Ingredients() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    unitOfMeasure: '',
    currentStock: 0,
    reorderLevel: 0,
    unitCost: 0,
    supplier: '',
  });

  const queryClient = useQueryClient();

  const { data: ingredients = [], isLoading } = useQuery({
    queryKey: ['ingredients'],
    queryFn: async () => {
      const response = await ingredientsApi.getAll();
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: ingredientsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      ingredientsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ingredientsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] });
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      unitOfMeasure: '',
      currentStock: 0,
      reorderLevel: 0,
      unitCost: 0,
      supplier: '',
    });
    setShowForm(false);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (ingredient: any) => {
    setFormData({
      name: ingredient.name,
      description: ingredient.description,
      unitOfMeasure: ingredient.unitOfMeasure,
      currentStock: ingredient.currentStock,
      reorderLevel: ingredient.reorderLevel,
      unitCost: ingredient.unitCost,
      supplier: ingredient.supplier || '',
    });
    setEditingId(ingredient.id);
    setShowForm(true);
  };

  if (isLoading) return <div className="loading">Loading...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Ingredients</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : '+ Add Ingredient'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="form-card">
          <div className="form-grid">
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Unit of Measure (e.g., kg, liters)"
              value={formData.unitOfMeasure}
              onChange={(e) => setFormData({ ...formData, unitOfMeasure: e.target.value })}
              required
            />
            <input
              type="number"
              step="0.01"
              placeholder="Current Stock"
              value={formData.currentStock}
              onChange={(e) => setFormData({ ...formData, currentStock: Number(e.target.value) })}
              required
            />
            <input
              type="number"
              step="0.01"
              placeholder="Reorder Level"
              value={formData.reorderLevel}
              onChange={(e) => setFormData({ ...formData, reorderLevel: Number(e.target.value) })}
              required
            />
            <input
              type="number"
              step="0.01"
              placeholder="Unit Cost"
              value={formData.unitCost}
              onChange={(e) => setFormData({ ...formData, unitCost: Number(e.target.value) })}
              required
            />
            <input
              type="text"
              placeholder="Supplier (optional)"
              value={formData.supplier}
              onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
            />
          </div>
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
          <button type="submit" className="btn-primary">
            {editingId ? 'Update' : 'Create'} Ingredient
          </button>
        </form>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Stock</th>
              <th>Reorder Level</th>
              <th>Unit Cost</th>
              <th>Supplier</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {ingredients.map((ingredient: any) => (
              <tr key={ingredient.id} className={ingredient.currentStock < ingredient.reorderLevel ? 'low-stock' : ''}>
                <td>{ingredient.name}</td>
                <td>{ingredient.description}</td>
                <td>{ingredient.currentStock} {ingredient.unitOfMeasure}</td>
                <td>{ingredient.reorderLevel} {ingredient.unitOfMeasure}</td>
                <td>${ingredient.unitCost.toFixed(2)}</td>
                <td>{ingredient.supplier || '-'}</td>
                <td>
                  <button onClick={() => handleEdit(ingredient)} className="btn-edit">Edit</button>
                  <button onClick={() => deleteMutation.mutate(ingredient.id)} className="btn-delete">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

