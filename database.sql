-- Database oluştur
CREATE DATABASE IF NOT EXISTS beautystore;
USE beautystore;

-- Products Tablosu
CREATE TABLE IF NOT EXISTS products (
    id INT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    price DECIMAL(10,2),
    rating DECIMAL(3,2),
    stock INT,
    brand VARCHAR(100),
    thumbnail TEXT
);

-- Users Tablosu
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(150) UNIQUE,
    password VARCHAR(255),
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
