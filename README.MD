# Microservice Project

## Description
This is a microservice-based application consisting of multiple independent services that work together to provide a complete solution. The project includes authentication, job management, payment processing, user management, utility services, and a frontend interface.

## Architecture Overview
The application follows a microservice architecture pattern, where each service is responsible for a specific business domain. Services communicate asynchronously using Kafka and store data in PostgreSQL with Redis for caching.

## Services

### Auth Service
- **Location**: `auth/`
- **Description**: Handles user authentication, registration, and authorization.
- **Technologies**: Node.js, Express, TypeScript, JWT, bcrypt, Kafka, Redis, PostgreSQL
- **Port**: (Check package.json or config for specific port)

### Jobs Service
- **Location**: `jobs/`
- **Description**: Manages job postings and applications.
- **Technologies**: Node.js, Express, TypeScript, Kafka, Redis, PostgreSQL
- **Port**: (Check package.json or config for specific port)

### Payment Service
- **Location**: `payment/`
- **Description**: Handles payment processing and transactions.
- **Technologies**: Node.js, Express, TypeScript, Kafka
- **Port**: (Check package.json or config for specific port)

### User Service
- **Location**: `user/`
- **Description**: Manages user profiles and data.
- **Technologies**: Node.js, Express, TypeScript, Kafka, Redis, PostgreSQL
- **Port**: (Check package.json or config for specific port)

### Utils Service
- **Location**: `utils/`
- **Description**: Provides utility functions and shared services, including Kafka consumer.
- **Technologies**: Node.js, Kafka
- **Port**: (Check package.json or config for specific port)

### Frontend
- **Location**: `frontend/`
- **Description**: React-based user interface for the application.
- **Technologies**: React, Vite, Tailwind CSS, Radix UI components
- **Port**: 5173 (default Vite dev server)

## Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL
- Redis
- Kafka
- Docker (optional, for containerized setup)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd microservice
   ```

2. Install dependencies for each service:
   ```bash
   # Auth service
   cd services/auth
   npm install

   # Jobs service
   cd ../jobs
   npm install

   # Payment service
   cd ../payment
   npm install

   # User service
   cd ../user
   npm install

   # Utils service
   cd ../utils
   npm install

   # Frontend
   cd ../frontend
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` in each service directory
   - Configure database connections, Kafka brokers, Redis URLs, and other secrets

4. Set up databases:
   - Create PostgreSQL databases for each service that requires it
   - Ensure Redis is running
   - Set up Kafka topics and brokers

## Running the Application

1. Start infrastructure services (PostgreSQL, Redis, Kafka):
   ```bash
   # Using Docker Compose (if available)
   docker-compose up -d
   ```

2. Start each microservice:
   ```bash
   # Auth service
   cd services/auth
   npm run dev

   # Jobs service
   cd ../jobs
   npm run dev

   # Payment service
   cd ../payment
   npm run dev

   # User service
   cd ../user
   npm run dev

   # Utils service
   cd ../utils
   npm run dev
   ```

3. Start the frontend:
   ```bash
   cd services/frontend
   npm run dev
   ```

4. Access the application:
   - Frontend: http://localhost:5173
   - API services: Check individual service configurations for ports

## API Documentation
Each service may have its own API documentation. Check the routes in each service's `src/routes/` directory for available endpoints.

## Development
- Use `npm run dev` in each service for development with hot reloading
- Build for production: `npm run build`
- Start production: `npm start`

## Testing
Run tests for each service:
```bash
npm test
```

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License
This project is licensed under the ISC License.
