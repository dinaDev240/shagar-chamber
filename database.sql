-- Shagar Chamber database
-- Import in XAMPP: open http://localhost/phpmyadmin -> Import -> choose this file -> Go

CREATE DATABASE IF NOT EXISTS shagar_chamber CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE shagar_chamber;

CREATE TABLE IF NOT EXISTS admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'admin',
  status VARCHAR(20) NOT NULL DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Default admin: admin@shagarchamber.com / Admin@12345
INSERT IGNORE INTO admin_users (full_name, email, password_hash, role, status) VALUES
('Shagar Chamber Admin', 'admin@shagarchamber.com', '$2b$10$LMG1aRCumhSIPv3NlGfsTOHhXypef74j9pSsX2YOrclgPbgJQgFg2', 'admin', 'Active');

CREATE TABLE IF NOT EXISTS contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(50),
  subject VARCHAR(255),
  message TEXT NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'New',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  event_type VARCHAR(100),
  description TEXT,
  event_date DATE,
  event_time VARCHAR(50),
  location VARCHAR(255),
  image_url VARCHAR(500),
  contact_email VARCHAR(150),
  contact_phone VARCHAR(50),
  status VARCHAR(30) DEFAULT 'Upcoming',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS expos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  type VARCHAR(100),
  description TEXT,
  image_url VARCHAR(500),
  location VARCHAR(255),
  start_date DATE,
  end_date DATE,
  contact_email VARCHAR(150),
  contact_phone VARCHAR(50),
  status VARCHAR(30) DEFAULT 'Upcoming',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS opportunities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  organization VARCHAR(255),
  location VARCHAR(255),
  description TEXT,
  requirements TEXT,
  contact_email VARCHAR(150),
  contact_phone VARCHAR(50),
  application_deadline DATE,
  status VARCHAR(30) DEFAULT 'Open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS job_applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  opportunity_id INT,
  job_title VARCHAR(255),
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(50),
  education TEXT,
  experience TEXT,
  cover_letter TEXT,
  cv_path VARCHAR(500),
  status VARCHAR(30) DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(50),
  national_id VARCHAR(100),
  national_id_front VARCHAR(500),
  national_id_back VARCHAR(500),
  tin_number VARCHAR(100),
  business_name VARCHAR(255),
  business_type VARCHAR(100),
  business_category VARCHAR(100),
  address VARCHAR(255),
  business_description TEXT,
  membership_type VARCHAR(100),
  membership_fee DECIMAL(12,2) DEFAULT 0,
  payment_status VARCHAR(30) DEFAULT 'Pending',
  payment_method VARCHAR(100),
  payment_receipt VARCHAR(500),
  status VARCHAR(30) DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS news (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  image_url VARCHAR(500),
  excerpt TEXT,
  content LONGTEXT,
  author VARCHAR(150),
  status VARCHAR(30) DEFAULT 'Published',
  published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS partnerships (
  id INT AUTO_INCREMENT PRIMARY KEY,
  partner_name VARCHAR(255) NOT NULL,
  partner_type VARCHAR(100),
  description TEXT,
  logo_url VARCHAR(500),
  website_url VARCHAR(500),
  contact_email VARCHAR(150),
  contact_phone VARCHAR(50),
  status VARCHAR(30) DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS revenue (
  id INT AUTO_INCREMENT PRIMARY KEY,
  revenue_type VARCHAR(100),
  description TEXT,
  payer_name VARCHAR(150),
  amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  payment_method VARCHAR(100),
  payment_status VARCHAR(30) DEFAULT 'Paid',
  payment_date DATE,
  reference VARCHAR(150),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
