# product-statistics

## Overview

This project is a coding challenge to create a MERN stack application that fetches product transaction data from a third-party API, initializes the database, and provides various APIs for transaction data retrieval and statistics. The frontend uses these APIs to display transaction data in a table and various charts.

## Backend

The backend is built using Node.js, Express, and MongoDB with Mongoose. It includes the following APIs:

1. **Initialize Database API**
   - **URL**: `/api/initialize`
   - **Method**: `GET`
   - Fetches JSON data from a third-party API and initializes the database with seed data.

2. **List Transactions API**
   - **URL**: `/api/transactions`
   - **Method**: `GET`
   - Lists all transactions with support for search and pagination.
   - **Parameters**:
     - `month`: String (e.g., "January")
     - `search`: String (optional)
     - `page`: Number (default: 1)
     - `perPage`: Number (default: 10)

3. **Statistics API**
   - **URL**: `/api/statistics`
   - **Method**: `GET`
   - Provides statistics for the selected month.
   - **Parameters**:
     - `month`: String (e.g., "January")

4. **Bar Chart API**
   - **URL**: `/api/bar-chart`
   - **Method**: `GET`
   - Provides the number of items in various price ranges for the selected month.
   - **Parameters**:
     - `month`: String (e.g., "January")

5. **Pie Chart API**
   - **URL**: `/api/pie-chart`
   - **Method**: `GET`
   - Provides the number of items in each category for the selected month.
   - **Parameters**:
     - `month`: String (e.g., "January")

6. **Combined Data API**
   - **URL**: `/api/combined-data`
   - **Method**: `GET`
   - Combines the responses from the statistics, bar chart, and pie chart APIs.
   - **Parameters**:
     - `month`: String (e.g., "January")

## Frontend

The frontend is built using React. It provides a single page interface with the following features:

1. **Transactions Table**
   - Lists transactions for the selected month with search and pagination functionality.
   - Includes a dropdown for month selection (default: March) and a search box for filtering transactions.

2. **Transaction Statistics**
   - Displays total sale amount, total sold items, and total not sold items for the selected month.

3. **Transactions Bar Chart**
   - Displays a bar chart of price ranges and the number of items in each range for the selected month.

## Getting Started

### Prerequisites

- Node.js
- MongoDB

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/product-statistics.git
   cd product-statistics
   ```

2. Install backend dependencies:
   ```sh
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```sh
   cd ../frontend
   npm install
   ```

### Running the Application

1. Start the backend server:
   ```sh
   cd backend
   npm start
   ```

2. Start the frontend development server:
   ```sh
   cd ../frontend
   npm start
   ```

3. Access the application at `http://localhost:3000`

## Usage

1. Use the "Initialize Database" API to fetch and seed the data.
2. Use the dropdown to select a month and view the transaction data, statistics, and charts.

## License

This project is licensed under the MIT License.

## Acknowledgements

- Third-party API data provided by Roxiler.

---
