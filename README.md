# Log-Nine

Log-Nine is a Kanban-like board system designed for logistical task management, originally built for Arma 3 scenarios. It features a modern React + TypeScript frontend and a .NET 8 backend with real-time updates via SignalR.

## Features

- Kanban board for managing tasks
- Team and person management
- Real-time updates using SignalR
- REST API backend with Entity Framework Core (SQLite)
- Dockerized deployment for both frontend and backend

## Project Structure

```
.
├── Server/                # .NET 8 backend (C#)
│   └── log-nine-backend/
├── Webpage/               # React + TypeScript frontend
├── compose.yaml           # Docker Compose for full stack
├── SeedTeams.sql          # Example SQL seed data
└── README.md
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (for frontend)
- [.NET 8 SDK](https://dotnet.microsoft.com/download) (for backend)
- [Docker](https://www.docker.com/) (optional, for containerized deployment)

### Environment Variables

- Backend: configure connection strings and settings in `Server/log-nine-backend/appsettings.json`
- Frontend: set `VITE_APP_BACKEND_URL` in `Webpage/.env` (see example in repo)

### Running Locally

#### Backend

```sh
cd Server/log-nine-backend
dotnet build
dotnet run
```

#### Frontend

```sh
cd Webpage
npm install
npm run dev
```

The frontend will be available at [http://localhost:8081](http://localhost:8081) and the backend at [http://localhost:8082](http://localhost:8082) (or as configured).

### Docker Compose

To run both frontend and backend with Docker:

```sh
docker compose up --build
```

This will start both services as defined in [compose.yaml](compose.yaml).

## API

The backend exposes a REST API for boards, tasks, teams, and people. See the Swagger UI at `/swagger` when running in development mode.

## Database

- Uses SQLite by default (see `AppContext.cs`)
- Seed data can be added via `SeedTeams.sql` or `DBSeeder.cs`

## Technologies Used

- **Frontend:** React, TypeScript, Vite, Material UI, React Query, SignalR
- **Backend:** .NET 8, ASP.NET Core, Entity Framework Core, SQLite, SignalR