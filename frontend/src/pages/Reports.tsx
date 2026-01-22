import { useQuery } from '@tanstack/react-query';
import { ordersApi, customersApi } from '../api/client';
import './SharedList.css';

export default function Reports() {
  const { data: orders = [] } = useQuery({
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

  // Calculate customer purchase summary
  const customerPurchases = customers.map((customer: any) => {
    const customerOrders = orders.filter((order: any) => order.customerId === customer.id);
    const totalAmount = customerOrders.reduce((sum: number, order: any) => sum + order.totalAmount, 0);
    const totalOrders = customerOrders.length;
    const totalItems = customerOrders.reduce((sum: number, order: any) => 
      sum + order.orderItems.reduce((itemSum: number, item: any) => itemSum + item.quantity, 0), 0);

    return {
      customerId: customer.id,
      customerName: customer.name,
      companyName: customer.companyName,
      customerType: customer.customerType,
      totalOrders,
      totalItems,
      totalAmount,
      orders: customerOrders,
    };
  }).filter((cp: any) => cp.totalOrders > 0);

  // Calculate overall stats
  const totalRevenue = orders.reduce((sum: number, order: any) => sum + order.totalAmount, 0);
  const totalOrdersCount = orders.length;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📊 Customer Purchase Reports</h1>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p className="stat-value">€{totalRevenue.toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p className="stat-value">{totalOrdersCount}</p>
        </div>
        <div className="stat-card">
          <h3>Active Customers</h3>
          <p className="stat-value">{customerPurchases.length}</p>
        </div>
        <div className="stat-card">
          <h3>Avg Order Value</h3>
          <p className="stat-value">€{totalOrdersCount > 0 ? (totalRevenue / totalOrdersCount).toFixed(2) : '0.00'}</p>
        </div>
      </div>

      <div className="table-container" style={{ marginTop: '30px' }}>
        <h2 style={{ padding: '20px', margin: 0, background: '#f8f9fa', borderBottom: '2px solid #e9ecef' }}>
          Customer Purchase Summary
        </h2>
        <table>
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Company</th>
              <th>Type</th>
              <th>Total Orders</th>
              <th>Total Items</th>
              <th>Total Spent</th>
            </tr>
          </thead>
          <tbody>
            {customerPurchases.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                  No orders yet. Create customers and orders to see purchase reports.
                </td>
              </tr>
            ) : (
              customerPurchases.map((cp: any) => (
                <tr key={cp.customerId}>
                  <td><strong>{cp.customerName}</strong></td>
                  <td>{cp.companyName || '-'}</td>
                  <td><span className="badge">{cp.customerType}</span></td>
                  <td>{cp.totalOrders}</td>
                  <td>{cp.totalItems}</td>
                  <td><strong>€{cp.totalAmount.toFixed(2)}</strong></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {customerPurchases.length > 0 && (
        <div className="table-container" style={{ marginTop: '30px' }}>
          <h2 style={{ padding: '20px', margin: 0, background: '#f8f9fa', borderBottom: '2px solid #e9ecef' }}>
            Detailed Order History
          </h2>
          <table>
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Items</th>
                <th>Status</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order: any) => (
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
                  <td><span className="badge">{order.status}</span></td>
                  <td><strong>€{order.totalAmount.toFixed(2)}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

