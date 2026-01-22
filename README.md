# StillMaster - Distillery Management System

A comprehensive management system for distilleries built with React + TypeScript and C# (.NET 10).

## Features

- **User Management**: Admin can create and manage users with role-based access control
- **Ingredients Management**: Track raw materials, stock levels, and suppliers
- **Stock Management**: Manage distilled products, batch numbers, aging periods, and inventory
- **Customer Management**: Maintain customer database with different customer types (Individual, Wholesale, Distributor, Retail)
- **Order Management**: Process orders, track shipments, and manage inventory automatically
- **JWT Authentication**: Secure authentication with role-based authorization

## Tech Stack

### Backend
- ASP.NET Core 10 Web API
- Entity Framework Core (In-Memory Database)
- ASP.NET Core Identity for authentication
- JWT Bearer authentication
- Clean Architecture (Core, Application, Infrastructure, API layers)

### Frontend
- React 18 with TypeScript
- Vite for fast development
- React Router for routing
- TanStack Query (React Query) for data fetching
- Zustand for state management
- Axios for HTTP requests

## Project Structure

```
StillMaster/
├── backend/
│   ├── StillMaster.API/          # Web API controllers and configuration
│   ├── StillMaster.Application/   # Business logic and DTOs
│   ├── StillMaster.Core/          # Domain entities
│   └── StillMaster.Infrastructure/# Data access and EF Core
└── frontend/
    └── src/
        ├── api/                   # API client
        ├── pages/                 # React components/pages
        └── store/                 # Zustand state management
```

## Getting Started

### Prerequisites
- .NET SDK 8.0 or later (Note: .NET 10 is coming, currently using .NET 8 LTS)
- Node.js 18+ and npm

### Running the Backend

```bash
cd backend/StillMaster.API
dotnet run
```

The API will start on `http://localhost:5000`

### Running the Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:5173`

## Default Credentials

**Admin User:**
- Email: `admin@stillmaster.com`
- Password: `Admin123!`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register new user (Admin only)

### Resources
- `/api/users` - User management (Admin only)
- `/api/ingredients` - Ingredients CRUD
- `/api/stocks` - Stock CRUD
- `/api/customers` - Customers CRUD
- `/api/orders` - Orders CRUD

## Database

The application currently uses an in-memory database that is seeded with sample data on startup. To switch to PostgreSQL:

1. Update `StillMaster.API/Program.cs`:
```csharp
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
```

2. Add connection string to `appsettings.json`
3. Install `Npgsql.EntityFrameworkCore.PostgreSQL` package
4. Run migrations

## Development Notes

- All timestamps are stored in UTC
- Stock quantities are automatically adjusted when orders are created
- Orders can only be deleted if they're in "Pending" or "Cancelled" status
- Low stock items are highlighted in the Ingredients view
- CORS is configured to allow requests from `localhost:5173` and `localhost:3000`

## Future Enhancements

- Complete implementation of Stock, Customers, Orders, and Users pages
- Reports and analytics dashboard
- PDF invoice generation
- Email notifications
- Batch recipe management
- Production scheduling
- Multi-language support
- Mobile app

## License

MIT

