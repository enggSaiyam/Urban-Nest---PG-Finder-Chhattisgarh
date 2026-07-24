-- ============================================================
-- Urban Nest - PG Finder for Chhattisgarh
-- MySQL Database Schema
-- ============================================================

CREATE DATABASE IF NOT EXISTS urban_nest CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE urban_nest;

-- -------------------------------------------------------
-- Table: users
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('tenant', 'owner') NOT NULL DEFAULT 'tenant',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -------------------------------------------------------
-- Table: pgs
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS pgs (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    description TEXT,
    rent INT UNSIGNED NOT NULL,
    pg_type ENUM('pg', 'hostel') NOT NULL DEFAULT 'pg',
    gender ENUM('male', 'female', 'any') NOT NULL DEFAULT 'any',
    total_rooms INT UNSIGNED NOT NULL DEFAULT 1,
    available_rooms INT UNSIGNED NOT NULL DEFAULT 0,
    amenities JSON COMMENT 'Array of amenity strings e.g. ["WiFi","AC","Meals"]',
    images JSON COMMENT 'Array of image URL strings (up to 5, max 20MB each)',
    owner_id INT UNSIGNED NOT NULL,
    is_available TINYINT(1) NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_city (city),
    INDEX idx_rent (rent),
    INDEX idx_owner (owner_id),
    INDEX idx_type_gender (pg_type, gender),
    INDEX idx_available (is_available),
    FULLTEXT INDEX ft_search (name, address),
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -------------------------------------------------------
-- Table: complaints
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS complaints (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    complainant_id INT UNSIGNED NOT NULL,
    pg_id INT UNSIGNED,
    subject VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    category ENUM('maintenance','noise','cleanliness','safety','billing','owner_behavior','other') NOT NULL DEFAULT 'other',
    status ENUM('pending','in_review','resolved','closed') NOT NULL DEFAULT 'pending',
    response TEXT COMMENT 'Owner or admin response to the complaint',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_complainant (complainant_id),
    INDEX idx_pg (pg_id),
    INDEX idx_status (status),
    FOREIGN KEY (complainant_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (pg_id) REFERENCES pgs(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -------------------------------------------------------
-- Table: cities  (static reference table for Chhattisgarh)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS cities (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- SEED: Cities of Chhattisgarh (all 33 districts + major towns)
-- ============================================================
INSERT INTO cities (name, district) VALUES
('Raipur','Raipur'),('Bilaspur','Bilaspur'),('Durg','Durg'),('Bhilai','Durg'),
('Korba','Korba'),('Rajnandgaon','Rajnandgaon'),('Raigarh','Raigarh'),
('Jagdalpur','Bastar'),('Ambikapur','Surguja'),('Dhamtari','Dhamtari'),
('Mahasamund','Mahasamund'),('Kanker','Kanker'),('Jashpur','Jashpur'),
('Kondagaon','Kondagaon'),('Narayanpur','Narayanpur'),('Bijapur','Bijapur'),
('Sukma','Sukma'),('Dantewada','Dantewada'),('Gariaband','Gariaband'),
('Baloda Bazar','Baloda Bazar'),('Mungeli','Mungeli'),('Balrampur','Balrampur'),
('Bemetara','Bemetara'),('Surajpur','Surajpur'),('Kawardha','Kabirdham'),
('Balod','Balod'),('Gaurela','Gaurela-Pendra-Marwahi'),('Pendra','Gaurela-Pendra-Marwahi'),
('Manendragarh','Manendragarh-Chirmiri-Bharatpur'),('Sakti','Sakti'),
('Khairagarh','Khairagarh-Chhuikhadan-Gandai'),('Champa','Janjgir-Champa'),
('Janjgir','Janjgir-Champa'),('Sarangarh','Sarangarh-Bilaigarh'),
('Dongargarh','Rajnandgaon'),('Takhatpur','Bilaspur'),('Pathalgaon','Jashpur'),
('Baikunthpur','Korea'),('Korea','Korea'),('Sarguja','Surguja');
