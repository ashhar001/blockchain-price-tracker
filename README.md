# Blockchain Price Tracker

This project is a Blockchain Price Tracker built using **Nest.js**, **TypeORM**, **PostgreSQL**, **Moralis API**, **nodemailer**, **Swagger**, and **Docker**. It tracks the prices of Ethereum and Polygon, provides alerts for price increases, and allows users to set price alerts.

## Features

1. **Automatically save the price of Ethereum and Polygon every 5 minutes.**
2. **Automatically send an email** if the price of a chain increases by more than 3% compared to its price one hour ago.
3. **API to get hourly prices** for the last 24 hours.
4. **API to set an alert** for a specific price.
5. **API to get the swap rate** from Ethereum to Bitcoin.
6. **Swagger documentation** available for API testing.

## Technologies Used

- **Nest.js**: Backend framework.
- **TypeORM**: ORM for interacting with the PostgreSQL database.
- **PostgreSQL**: Relational database.
- **Moralis API**: To fetch current cryptocurrency prices.
- **Nodemailer**: For sending email notifications.
- **Swagger**: For documenting and testing APIs.
- **Docker**: Containerization.

## Prerequisites

- **Node.js**: >= 14.x
- **npm**: >= 6.x
- **Docker** (optional, if running in a containerized environment)
- **PostgreSQL**: Local instance or Dockerized version

## Project Setup Instructions

### Step 1: Clone the Repository

```bash
$ git clone <your-repo-url>
$ cd blockchain-price-tracker
```

### Step 2: Install Dependencies

```bash
$ npm install
```

### Step 3: Set Up Environment Variables

Create a `.env` file in the root directory of the project to hold your environment-specific variables.

**Example `.env` file**:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=price_tracker
MORALIS_API_KEY=your_moralis_api_key
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password
```

- Replace `your_password`, `your_moralis_api_key`, `your-email@gmail.com`, and `your-email-password` with the appropriate values.

### Step 4: Set Up PostgreSQL Database

1. **Install PostgreSQL** (skip this if using Docker for PostgreSQL).
2. **Create the Database**:

   ```bash
   $ psql -U postgres
   postgres=# CREATE DATABASE price_tracker;
   postgres=# CREATE USER price_tracker_user WITH PASSWORD 'your_password';
   postgres=# GRANT ALL PRIVILEGES ON DATABASE price_tracker TO price_tracker_user;
   ```

### Step 5: Run the Application Locally

```bash
$ npm run start:dev
```

The application should now be running on `http://localhost:3000`.

- **Swagger Documentation** can be accessed at `http://localhost:3000/api`.

### Step 6: Testing APIs with Swagger

Navigate to `http://localhost:3000/api` to see all available endpoints, including:
- **Set Price Alert** (`POST /price/set-alert`): Set a price alert.
- **Get Hourly Prices** (`GET /price/hourly`): Get hourly prices for the last 24 hours.
- **Get Swap Rate** (`GET /price/swap-rate`): Get the swap rate from ETH to BTC.

### Step 7: Running the Application with Docker

**Build and Run Docker Containers**

   ```bash
   $ docker-compose up --build
   ```

   The application should now be accessible on `http://localhost:3000`.
   Swagger Documentation can be accessed at `http://localhost:3000/api`.
