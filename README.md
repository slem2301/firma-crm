# FIRMA CRM — Full-Stack Application

Full-stack CRM system built as a portfolio project to demonstrate modern software engineering practices.

The project includes authentication, role-based access control, REST APIs, and a scalable backend architecture.
The application is designed to run locally using Docker with a single command.

The CRM interface is in Russian and was originally developed for a client based in Belarus.

---

## Tech Stack

Frontend:
- React
- Next.js
- TypeScript
- Tailwind CSS

Backend:
- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Role-based access control (RBAC)

Infrastructure:
- Docker
- Docker Compose

---

## Quick Start (Docker)

1. Clone the repository

```bash
git clone https://github.com/slem2301/firma-crm.git
cd firma-crm
```

2. Create environment files

```bash
cp firma-crm-backend/.env.example firma-crm-backend/.env
cp firma-crm-frontend/.env.example firma-crm-frontend/.env
```

3. Run the application

```bash
docker compose up --build
```

4. Migrate and seed data base
```bash
docker compose exec backend npx prisma migrate dev
docker compose exec backend npx prisma db seed
```

5. If you want to look Data base
```bash
docker compose exec backend npx prisma studio --port 5555 --browser none
```
And open localhost:5555

---

## Project Structure

```text
firma-crm/
├─ firma-crm-frontend/
│  ├─ src/
│  ├─ public/
│  ├─ .env.example
│  ├─ Dockerfile.dev
│  └─ package.json
├─ firma-crm-backend/
│  ├─ src/
│  ├─ prisma/
│  ├─ test/
│  ├─ .env.example
│  ├─ Dockerfile.dev
│  └─ package.json
├─ docker-compose.yml
└─ README.md
```
---

## Features

- User authentication (JWT)
- Role-based access control (Admin / User)
- REST API
- PostgreSQL database with Prisma
- Modular NestJS architecture
- Dockerized local development
- Frontend and backend separation
- Russian-language CRM interface

---

## Requirements

- Docker
- Docker Compose

---

## Environment Variables

This project uses environment variables for configuration.
Actual .env files are not committed to the repository.

Backend (.env.example):
DATABASE_URL=postgresql://crm:crm@db:5432/crm?schema=public
JWT_SECRET=super-secret-jwt-key-change-me

Frontend (.env.example):
REACT_APP_API_URL=http://localhost:4000

---

## Available Services

Frontend:
http://localhost:3000

Backend API:
http://localhost:4000

Swagger (if enabled):
http://localhost:4000/api

PostgreSQL:
localhost:5432

---

## Test Admin Account

Email:
admin@test.com

Password:
NewPass123!

---

## Database Migrations (Prisma)

docker compose exec backend npx prisma migrate deploy

Optional seed:
docker compose exec backend npx prisma db seed

---

## Stop the Application

docker compose down

---

## Purpose of the Project

This project demonstrates:
- Full-stack development skills
- Modern JavaScript / TypeScript stack
- Backend architecture with NestJS
- REST API design
- Database modeling with Prisma
- Docker-based development workflow
- Real-world CRM development for an external client

---

## Author

Anton Vishneuski
Software Engineer / Full-Stack Developer
United States

---

## License

Educational and portfolio use only.
