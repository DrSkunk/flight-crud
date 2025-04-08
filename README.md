# Flight CRUD API

A RESTful API for managing flight information with user authentication.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm (v6 or higher)

## Installation

Clone the repository

```
git clone <repository-url>
cd flight-crud
```

Install dependencies

```
npm install
```

Create a `.env` file in the root directory with the following variables:

```
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/flight-crud
JWT_SECRET=please_change_me
```

### Environment Variables

This application uses both mandatory and optional environment variables:

**Mandatory Environment Variables:**

- `MONGODB_URI`: Connection string to your MongoDB database
- `JWT_SECRET`: Secret key used for JWT token generation and validation

These variables must be defined or the application will fail to start.

**Optional Environment Variables:**

- `PORT`: The port the server will run on (default: `3000`)
- `NODE_ENV`: Application environment (default: `development`)
- `API_PREFIX`: Prefix for API routes (default: `/api/v1`)
- `JWT_EXPIRES_IN`: JWT token expiration time (default: `30d`)

Optional variables will use their default values if not explicitly set.

## Running the Application

Start the server:

```
npm start
```

The API will be available at: http://localhost:3000

Swagger documentation: http://localhost:3000/api/v1/docs

## Running Tests

Tests are made with Vitest.
Run them with the following command:

```
npm test
```
