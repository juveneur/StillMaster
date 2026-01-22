import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi, customersApi, stocksApi } from '../api/client';
import './SharedList.css';

export default function Orders() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    customerId: 0,
    orderDate: new Date().toISOString().split('T')[0],
    taxAmount: 0,
    shippingAmount: 9.99,
    notes: '',
    shippingAddress: '',
    orderItems: [] as Array<{ stockId: number; quantity: number }>,
  });
  const [selectedStock, setSelectedStock] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);

  const queryClient = useQueryClient();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await ordersApi.getAll();
      return response.data;
    },
  });

  const { data: customers = [] } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const response = await customersApi.getAll();
      return response.data;
    },
  });

  const { data: stocks = [] } = useQuery({
    queryKey: ['stocks'],
    queryFn: async () => {
      const response = await stocksApi.getAll();
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: ordersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['stocks'] });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      ordersApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ordersApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['stocks'] });
    },
  });

  const resetForm = () => {
    setFormData({
      customerId: 0,
      orderDate: new Date().toISOString().split('T')[0],
      taxAmount: 0,
      shippingAmount: 9.99,
      notes: '',
      shippingAddress: '',
      orderItems: [],
    });
    setShowForm(false);
  };

  const addOrderItem = () => {
    if (selectedStock && quantity > 0) {
      const stock = stocks.find((s: any) => s.id === selectedStock);
      if (!stock) return;

      // Check if item already exists
      const existingIndex = formData.orderItems.findIndex(
        (item) => item.stockId === selectedStock
      );

      if (existingIndex >= 0) {
        // Update existing item
        const newItems = [...formData.orderItems];
        newItems[existingIndex].quantity += quantity;
        setFormData({ ...formData, orderItems: newItems });
      } else {
        // Add new item
        setFormData({
          ...formData,
          orderItems: [
            ...formData.orderItems,
            { stockId: selectedStock, quantity },
          ],
        });
      }

      setSelectedStock(0);
      setQuantity(1);
    }
  };

  const removeOrderItem = (stockId: number) => {
    setFormData({
      ...formData,
      orderItems: formData.orderItems.filter((item) => item.stockId !== stockId),
    });
  };

  const calculateSubtotal = () => {
    return formData.orderItems.reduce((sum, item) => {
      const stock = stocks.find((s: any) => s.id === item.stockId);
      return sum + (stock ? stock.unitPrice * item.quantity : 0);
    }, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.orderItems.length === 0) {
      alert('Please add at least one product to the order');
      return;
    }
    createMutation.mutate(formData);
  };

  const handleStatusUpdate = (orderId: number, newStatus: string) => {
    updateMutation.mutate({
      id: orderId,
      data: { status: newStatus },
    });
  };

  const subtotal = calculateSubtotal();
  const total = subtotal + formData.taxAmount + formData.shippingAmount;

  if (isLoading) return <div className="loading">Loading...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📦 Order Management</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : '+ Create Order'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="form-card">
          <h3>New Order</h3>
          
          <div className="form-grid">
            <select
              value={formData.customerId}
              onChange={(e) => setFormData({ ...formData, customerId: Number(e.target.value) })}
              required
            >
              <option value={0}>Select Customer *</option>
              {customers.map((customer: any) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} {customer.companyName ? `(${customer.companyName})` : ''}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={formData.orderDate}
              onChange={(e) => setFormData({ ...formData, orderDate: e.target.value })}
              required
            />

            <input
              type="number"
              step="0.01"
              placeholder="Tax Amount (€)"
              value={formData.taxAmount}
              onChange={(e) => setFormData({ ...formData, taxAmount: Number(e.target.value) })}
            />

            <input
              type="number"
              step="0.01"
              placeholder="Shipping (€)"
              value={formData.shippingAmount}
              onChange={(e) => setFormData({ ...formData, shippingAmount: Number(e.target.value) })}
            />
          </div>

          <textarea
            placeholder="Shipping Address"
            value={formData.shippingAddress}
            onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
            rows={2}
          />

          <textarea
            placeholder="Order Notes (optional)"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={2}
          />

          <div style={{ marginTop: '20px' }}>
            <h4>Order Items</h4>
            <div className="form-grid" style={{ marginTop: '10px' }}>
              <select
                value={selectedStock}
                onChange={(e) => setSelectedStock(Number(e.target.value))}
              >
                <option value={0}>Select Product</option>
                {stocks.map((stock: any) => (
                  <option key={stock.id} value={stock.id}>
                    {stock.productName} - €{stock.unitPrice.toFixed(2)} ({stock.quantityInStock} in stock)
                  </option>
                ))}
              </select>

              <input
                type="number"
                min="1"
                placeholder="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />

              <button type="button" onClick={addOrderItem} className="btn-primary">
                Add Item
              </button>
            </div>

            {formData.orderItems.length > 0 && (
              <div style={{ marginTop: '15px' }}>
                <table style={{ width: '100%' }}>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Unit Price</th>
                      <th>Total</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.orderItems.map((item) => {
                      const stock = stocks.find((s: any) => s.id === item.stockId);
                      return (
                        <tr key={item.stockId}>
                          <td>{stock?.productName}</td>
                          <td>{item.quantity}</td>
                          <td>€{stock?.unitPrice.toFixed(2)}</td>
                          <td>€{(stock ? stock.unitPrice * item.quantity : 0).toFixed(2)}</td>
                          <td>
                            <button
                              type="button"
                              onClick={() => removeOrderItem(item.stockId)}
                              className="btn-delete"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                <div style={{ marginTop: '15px', textAlign: 'right', fontSize: '16px' }}>
                  <p><strong>Subtotal:</strong> €{subtotal.toFixed(2)}</p>
                  <p><strong>Tax:</strong> €{formData.taxAmount.toFixed(2)}</p>
                  <p><strong>Shipping:</strong> €{formData.shippingAmount.toFixed(2)}</p>
                  <p style={{ fontSize: '18px', color: '#667eea' }}>
                    <strong>Total: €{total.toFixed(2)}</strong>
                  </p>
                </div>
              </div>
            )}
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '20px' }}>
            Create Order
          </button>
        </form>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Order #</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                  No orders yet. Create your first order above.
                </td>
              </tr>
            ) : (
              orders.map((order: any) => (
                <tr key={order.id}>
                  <td><strong>{order.orderNumber}</strong></td>
                  <td>{order.customerName}</td>
                  <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                  <td>
                    {order.orderItems.map((item: any, idx: number) => (
                      <div key={idx} style={{ fontSize: '13px', color: '#666' }}>
                        {item.productName} x{item.quantity}
                      </div>
                    ))}
                  </td>
                  <td><strong>€{order.totalAmount.toFixed(2)}</strong></td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                      style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #ddd' }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>
                    <button
                      onClick={() => deleteMutation.mutate(order.id)}
                      className="btn-delete"
                      disabled={order.status !== 'Pending' && order.status !== 'Cancelled'}
                      title={order.status !== 'Pending' && order.status !== 'Cancelled' ? 'Can only delete pending or cancelled orders' : ''}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
