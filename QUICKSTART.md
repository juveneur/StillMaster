# Quick Start Guide

## Running the Application

### Terminal 1 - Backend API
```bash
cd /Users/tijones/Documents/CursorProjects/StillMaster/backend/StillMaster.API
dotnet run
```

The API will be available at: `http://localhost:5000`

### Terminal 2 - Frontend
```bash
cd /Users/tijones/Documents/CursorProjects/StillMaster/frontend
npm run dev
```

The frontend will be available at: `http://localhost:5173`

## Login

Navigate to `http://localhost:5173` and login with:
- **Email:** `admin@stillmaster.com`
- **Password:** `Admin123!`

## Features Implemented

✅ **Backend (Complete)**
- Clean architecture with 4 layers (API, Application, Infrastructure, Core)
- JWT authentication with ASP.NET Identity
- All CRUD endpoints for Users, Ingredients, Stock, Customers, Orders
- Role-based authorization (Admin and User roles)
- In-memory database with seeded data
- Automatic stock adjustment on order creation

✅ **Frontend (Core Complete)**
- Login/Logout with JWT
- Protected routes with authentication
- Dashboard with module navigation
- **Ingredients page** - Fully functional CRUD operations
- Placeholder pages for Stock, Customers, Orders, Users
- Responsive design
- State management with Zustand
- API integration with React Query

## Next Steps for Development

The core infrastructure is complete. To extend the system:

1. **Implement remaining CRUD pages** - Copy the Ingredients.tsx pattern for:
   - Stock management
   - Customer management
   - Order management (with order items)
   - User management (admin only)

2. **Add Reports & Analytics**
   - Sales reports
   - Inventory reports
   - Low stock alerts

3. **Enhanced Features**
   - Search and filtering
   - Pagination
   - Export to Excel/PDF
   - Email notifications

## API Documentation

Visit `http://localhost:5000/openapi/v1.json` when the API is running to see the OpenAPI specification.

## Troubleshooting

**CORS errors:** Make sure the backend is running on port 5000

**Build errors:** Run `dotnet restore` in the backend folder

**npm errors:** Delete `node_modules` and `package-lock.json`, then run `npm install` again

---

**Note:** The application uses .NET 8 (LTS) as .NET 10 is not yet released. When .NET 10 becomes available, simply update the `TargetFramework` in the `.csproj` files.

