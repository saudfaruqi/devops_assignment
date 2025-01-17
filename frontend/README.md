User Management System

This project is a user management system built with React.js for the frontend and Node.js with Express for the backend. It allows users to add, update, delete, and view users, and it integrates with a MySQL database for data storage.

Prerequisites

Before running the project, ensure you have the following installed:

Node.js (v14 or higher) - Download Node.js
MySQL - Download MySQL
Docker (optional, for containerized deployment) - Download Docker


Backend Setup

Clone the repository:
git clone <repository-url>
cd devops_assignment/backend
Install backend dependencies:
Run the following command in the backend directory to install the required packages:

npm install


Set up the MySQL database:

Create a new MySQL database called user_management and run the following SQL to create the necessary table:

CREATE DATABASE user_management;
USE user_management;

CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY,
  fullName VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  age INT,
  gender VARCHAR(50),
  address TEXT
);

Configure MySQL connection:
Ensure that the server.js file in the backend directory has the correct database credentials:

const db = mysql.createConnection({
  host: 'localhost', // Update if needed
  user: 'root', // Your MySQL username
  password: '', // Your MySQL password
  database: 'user_management'
});


Start the backend server:

Run the following command to start the backend server:

npm start

The backend server will run on http://localhost:3001.


Frontend Setup

Navigate to the frontend directory:

cd devops_assignment/frontend

Install frontend dependencies:

Run the following command to install the required packages:

npm install

Start the frontend server:

Run the following command to start the frontend server:

npm start
The frontend will run on http://localhost:3000.


Running with Docker (Optional)

If you prefer using Docker, you can run both the frontend and backend in Docker containers.

Build and run the Docker containers:

Make sure you have docker-compose.yml set up in the project root directory. If not, use the following configuration:

version: '3'
services:
  backend:
    build: ./backend
    ports:
      - 3001:3001
    environment:
      - MYSQL_HOST=db
      - MYSQL_USER=root
      - MYSQL_PASSWORD=root
      - MYSQL_DATABASE=user_management
    depends_on:
      - db
  frontend:
    build: ./frontend
    ports:
      - 3000:3000
    depends_on:
      - backend
  db:
    image: mysql:latest
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: user_management
    volumes:
      - db-data:/var/lib/mysql
volumes:
  db-data:

Build and start the containers:

docker-compose up --build

This will start the frontend, backend, and MySQL database in separate containers.