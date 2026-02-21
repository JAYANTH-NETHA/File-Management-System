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

## Notes

- Backend port is configured in `backend/src/main/resources/application.properties`.
- Frontend dev port is configured in `frontend/vite.config.ts`.
- Frontend API base URL is configured in `frontend/src/services/api.ts`.
