import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { stocksApi } from '../api/client';
import './SharedList.css';

export default function Stock() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    productName: '',
    productType: 'Whiskey',
    batchNumber: '',
    quantityInStock: 0,
    unitOfMeasure: 'bottles',
    alcoholByVolume: 0,
    distillationDate: '',
    bottlingDate: '',
    agingPeriodMonths: 0,
    barrelType: '',
    unitPrice: 0,
    location: 'Main Warehouse',
  });

  const queryClient = useQueryClient();

  const { data: stocks = [], isLoading } = useQuery({
    queryKey: ['stocks'],
    queryFn: async () => {
      const response = await stocksApi.getAll();
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: stocksApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stocks'] });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      stocksApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stocks'] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: stocksApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stocks'] });
    },
  });

  const resetForm = () => {
    setFormData({
      productName: '',
      productType: 'Whiskey',
      batchNumber: '',
      quantityInStock: 0,
      unitOfMeasure: 'bottles',
      alcoholByVolume: 0,
      distillationDate: '',
      bottlingDate: '',
      agingPeriodMonths: 0,
      barrelType: '',
      unitPrice: 0,
      location: 'Main Warehouse',
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

  const handleEdit = (stock: any) => {
    setFormData({
      productName: stock.productName,
      productType: stock.productType,
      batchNumber: stock.batchNumber || '',
      quantityInStock: stock.quantityInStock,
      unitOfMeasure: stock.unitOfMeasure,
      alcoholByVolume: stock.alcoholByVolume,
      distillationDate: stock.distillationDate ? stock.distillationDate.split('T')[0] : '',
      bottlingDate: stock.bottlingDate ? stock.bottlingDate.split('T')[0] : '',
      agingPeriodMonths: stock.agingPeriodMonths || 0,
      barrelType: stock.barrelType || '',
      unitPrice: stock.unitPrice,
      location: stock.location,
    });
    setEditingId(stock.id);
    setShowForm(true);
  };

  if (isLoading) return <div className="loading">Loading...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>🥃 Stock Management</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : '+ Add Product'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="form-card">
          <div className="form-grid">
            <input
              type="text"
              placeholder="Product Name"
              value={formData.productName}
              onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
              required
            />
            <select
              value={formData.productType}
              onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
              required
            >
              <option value="Whiskey">Irish Whiskey</option>
              <option value="Gin">Irish Gin</option>
              <option value="Poitín">Irish Poitín</option>
              <option value="Cream">Irish Cream</option>
            </select>
            <input
              type="text"
              placeholder="Batch Number (optional)"
              value={formData.batchNumber}
              onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
            />
            <input
              type="number"
              step="1"
              placeholder="Quantity in Stock"
              value={formData.quantityInStock}
              onChange={(e) => setFormData({ ...formData, quantityInStock: Number(e.target.value) })}
              required
            />
            <input
              type="text"
              placeholder="Unit (e.g., bottles, cases)"
              value={formData.unitOfMeasure}
              onChange={(e) => setFormData({ ...formData, unitOfMeasure: e.target.value })}
              required
            />
            <input
              type="number"
              step="0.1"
              placeholder="ABV %"
              value={formData.alcoholByVolume}
              onChange={(e) => setFormData({ ...formData, alcoholByVolume: Number(e.target.value) })}
              required
            />
            <input
              type="number"
              step="0.01"
              placeholder="Unit Price (€)"
              value={formData.unitPrice}
              onChange={(e) => setFormData({ ...formData, unitPrice: Number(e.target.value) })}
              required
            />
            <input
              type="text"
              placeholder="Location/Warehouse"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />
            <input
              type="date"
              placeholder="Distillation Date"
              value={formData.distillationDate}
              onChange={(e) => setFormData({ ...formData, distillationDate: e.target.value })}
            />
            <input
              type="date"
              placeholder="Bottling Date"
              value={formData.bottlingDate}
              onChange={(e) => setFormData({ ...formData, bottlingDate: e.target.value })}
            />
            <input
              type="number"
              placeholder="Aging Period (months)"
              value={formData.agingPeriodMonths}
              onChange={(e) => setFormData({ ...formData, agingPeriodMonths: Number(e.target.value) })}
            />
            <input
              type="text"
              placeholder="Barrel Type (optional)"
              value={formData.barrelType}
              onChange={(e) => setFormData({ ...formData, barrelType: e.target.value })}
            />
          </div>
          <button type="submit" className="btn-primary">
            {editingId ? 'Update' : 'Create'} Product
          </button>
        </form>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Type</th>
              <th>Batch</th>
              <th>Stock</th>
              <th>ABV</th>
              <th>Price</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock: any) => (
              <tr key={stock.id} className={stock.quantityInStock < 10 ? 'low-stock' : ''}>
                <td><strong>{stock.productName}</strong></td>
                <td>{stock.productType}</td>
                <td>{stock.batchNumber || '-'}</td>
                <td>{stock.quantityInStock} {stock.unitOfMeasure}</td>
                <td>{stock.alcoholByVolume}%</td>
                <td>€{stock.unitPrice.toFixed(2)}</td>
                <td>{stock.location}</td>
                <td>
                  <button onClick={() => handleEdit(stock)} className="btn-edit">Edit</button>
                  <button onClick={() => deleteMutation.mutate(stock.id)} className="btn-delete">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
