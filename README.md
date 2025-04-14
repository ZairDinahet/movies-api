
# Movie API - Backend

This project provides a backend service for a movie management API, built with **NestJS**. It utilizes **Prisma** as the ORM, and **JWT** for secure authentication and authorization. The API allows the management of users and movies, provides secure session handling with cookies, and integrates external movie data from the **Star Wars API (SWAPI)**.

## Technologies Used

- **Node.js** (v14 or later) - JavaScript runtime environment.
- **TypeScript** - Type-safe programming language used throughout the project.
- **NestJS** - A framework for building efficient, scalable Node.js applications.
- **Prisma** - ORM used for seamless database integration.
- **JWT & Cookie-parser** - For user authentication and secure session management using JWT tokens.
- **Bcrypt** - A library used for securely hashing passwords.
- **Swagger** - Used to document and test the API endpoints.
- **Jest** - A JavaScript testing framework used for unit tests.

## Features

- **User Management**:
  - User registration and login
  - Password hashing with bcrypt
  - Role-based access control (Admin, User)
  
- **Authentication**:
  - Secure JWT-based authentication for users.
  - Access tokens and refresh tokens managed through HTTP-only cookies.
  
- **Movie Management**:
  - CRUD operations for movies.
  - External data integration with the [Star Wars API (SWAPI)](https://swapi.dev/) to enrich movie details.
  - CRUD actions limited according to user role

- **Documentation**:
  - Swagger-based API documentation for all endpoints.
  
## Requirements

- **Node.js** and **npm** installed (v14 or later).
  To check, run:

  ```bash
  node -v
  npm -v
  ```

- **PostgreSQL** database (local or cloud-based).
  
- (Optional) Prisma CLI (if you plan to use it globally):

  ```bash
  npm install -g prisma
  ```

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/ZairDinahet/movies-api
cd movies-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create your `.env` file based on the provided `.env.example`:

```bash
cp .env.example .env
```

Then edit the `.env` file with your actual credentials and configuration values:

### Required Environment Variables

- **`DATABASE_URL`**: PostgreSQL connection string with credentials.

    Example:
    ```
    DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/movies_db
    ```

- **`JWT_SECRET`**: Secret key used for signing access tokens.
- **`JWT_REFRESH_SECRET`**: Secret key used for signing refresh tokens.
- **`JWT_EXPIRATION_TIME`**: Expiration time for the access token (e.g., `1h`).
- **`JWT_REFRESH_EXPIRATION_TIME`**: Expiration time for the refresh token (e.g., `7d`).

### 4. Set up the database with Prisma

Run Prisma migrations to initialize your database schema:

```bash
npx prisma migrate dev --name init
```

Generate Prisma client:

```bash
npx prisma generate
```

### 5. Start the development server

```bash
npm run start:dev
```

The server will run on `http://localhost:3000` by default.

### 6. Access the Swagger documentation

Once the server is running, you can explore the API documentation at:

```bash
http://localhost:3000/docs
```

## Project Structure

- **`src/auth`**: Authentication module, handling user registration, login, JWT strategies, and session management.
- **`src/users`**: User management module, including CRUD operations, user roles, and access control.
- **`src/movies`**: Movie management module, supporting CRUD operations and integrating with the Star Wars API (SWAPI) for additional movie data.
- **`src/common`**: Contains shared utilities such as password hashing helpers, guards, DTOs, and other common functions.
- **`src/core`**: Contains global configuration files, exception handling, and setup for the application.


## Running Tests

Unit tests are implemented using **Jest**. To run the tests:

```bash
npm run test
```

### Additional Notes

- **Session management**: The project uses **HTTP-only cookies** to store refresh tokens securely, ensuring better security and minimizing the risk of XSS attacks.
  
- **SWAPI Integration**: The project integrates external data from the **Star Wars API (SWAPI)** to enhance movie details. This allows for richer and more dynamic movie data.
