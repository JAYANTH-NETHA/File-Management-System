# Secure File Management System

A full-stack CRM-oriented secure file management application.

## Tech Stack

- Frontend: React + TypeScript + Vite
- Backend: Spring Boot (Java 17)
- Database: MySQL

## Prerequisites

- Node.js (with npm or pnpm)
- Java 17+
- Maven
- MySQL

## Student Quick Start (Recommended)

Open **two terminals** from the project root.

### Terminal A - Backend

```sh
cd backend
mvn spring-boot:run
```

Expected backend URL:

- `http://localhost:8080/api`

### Terminal B - Frontend

If `pnpm` is not installed:

```sh
npm install -g pnpm
```

Then run:

```sh
cd frontend
pnpm install
pnpm dev
```

Expected frontend URL:

- `http://localhost:3000`

## Verify Everything Is Running

- Open `http://localhost:3000` in browser (frontend should load).
- Backend should be running on `http://localhost:8080/api`.
- If backend is up, protected endpoints may return `401/403` without login; that is normal.

## Project Structure

- `frontend/` - React application
- `backend/` - Spring Boot API

## Run Locally

### 1) Start Backend

```sh
cd backend
mvn spring-boot:run
```

Backend runs at:

- `http://localhost:8080/api`

### 2) Start Frontend

Using pnpm:

```sh
cd frontend
pnpm install
pnpm dev
```

Or using npm:

```sh
cd frontend
npm install
npm run dev
```

Frontend runs at:

- `http://localhost:3000`

## Troubleshooting (Students)

- If frontend starts on a different port (like `3001`), it means `3000` is already in use. Stop other frontend terminals and run `pnpm dev` again.
- If frontend fails with `'vite' is not recognized`, run `pnpm install` inside `frontend/` and retry.
- If backend fails to connect to DB, check MySQL is running and credentials in `backend/src/main/resources/application.properties` are valid.

## Notes

- Backend port is configured in `backend/src/main/resources/application.properties`.
- Frontend dev port is configured in `frontend/vite.config.ts`.
- Frontend API base URL is configured in `frontend/src/services/api.ts`.
