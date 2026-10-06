Create database rafifa_mart;

use  rafifa_mart;

-- table craetion ---

CREATE TABLE customers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address varchar(50),
  account_status ENUM('active', 'blocked') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE addresses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  customer_id INT,
  label VARCHAR(50),
  recipient_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  address_line1 VARCHAR(255) NOT NULL,
  address_line2 VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  district VARCHAR(100),
  division VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100) NOT NULL DEFAULT 'Bangladesh',
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  perfume_type VARCHAR(50),      -- 'floral','fresh','amber','woody','gourmand','citrusy'
  perfume_for VARCHAR(20),       -- 'Male','Female'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE product_variants (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  packaging_type ENUM('atar','spray') NOT NULL,
  volume_ml INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY uq_variant (product_id, packaging_type, volume_ml)
);

CREATE TABLE product_images (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT,
  image_url VARCHAR(255),
  is_primary BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE bottles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  photo_url VARCHAR(255) NOT NULL,
  total_piece INT DEFAULT 0,
  volume ENUM('3ml','6ml','8ml','12ml') NOT NULL,
  price_per_piece DECIMAL(10,2) DEFAULT 0.00,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  customer_id INT,
  address_id INT,
  payment_method ENUM('cod', 'online') NOT NULL,
  status ENUM('pending', 'confirmed', 'shipped', 'delivered', 'rejected') DEFAULT 'pending',
  total_amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  FOREIGN KEY (address_id) REFERENCES addresses(id)
);

CREATE TABLE order_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT,
  variant_id INT,
  quantity INT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  item_type ENUM('perfume') DEFAULT 'perfume',
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE SET NULL
);

CREATE TABLE order_bottles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  bottle_id INT NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (bottle_id) REFERENCES bottles(id) ON DELETE CASCADE
);

CREATE TABLE ratings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT,
  customer_id INT,
  rating TINYINT CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

CREATE TABLE offers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  offer_name VARCHAR(100),
  title VARCHAR(150),
  punchline VARCHAR(255),
  thumbnail VARCHAR(255),
  discount_type ENUM('flat', 'percentage') NOT NULL,
  discount_value DECIMAL(10,2) NOT NULL,
  valid_from DATE,
  valid_until DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE product_offers (
  product_id INT,
  offer_id INT,
  PRIMARY KEY (product_id, offer_id),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (offer_id) REFERENCES offers(id) ON DELETE CASCADE
);


CREATE TABLE sessions (
  session_id VARCHAR(255) PRIMARY KEY,
  customer_id INT,
  data TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- Dummy Data --
SET SQL_SAFE_UPDATES = 0;


INSERT INTO ratings (product_id, customer_id, rating, comment, created_at) VALUES
(1, 1, 5, 'Amazing scent, lasts all day!', '2026-06-20 10:15:00'),
(1, 2, 4, 'Really nice, but a bit strong at first.', '2026-06-21 14:30:00'),
(2, 3, 5, 'My favorite cologne so far.', '2026-06-22 09:00:00'),
(2, 4, 3, 'Good but fades quickly.', '2026-06-23 18:45:00'),
(3, 5, 5, 'Smoky oud is exactly what I wanted.', '2026-06-24 11:20:00'),
(3, 1, 4, 'Great for winter nights.', '2026-06-25 16:10:00'),
(4, 2, 5, 'Delicate and elegant, love it!', '2026-06-26 08:30:00'),
(4, 6, 4, 'Perfect for daily wear.', '2026-06-27 13:00:00'),
(5, 7, 5, 'So fresh and citrusy, great for summer.', '2026-06-28 10:05:00'),
(5, 3, 2, 'Too light for my taste.', '2026-06-29 19:20:00'),
(6, 8, 4, 'Nice floral notes, subtle.', '2026-06-30 12:40:00'),
(1, 8, 3, 'Decent, but overpriced.', '2026-07-01 09:15:00');


INSERT INTO bottles (name, photo_url, total_piece, volume, price_per_piece, description, created_at, updated_at) VALUES
('Classic Glass Bottle', 'https://example.com/images/bottles/classic-glass.jpg', 100, 50, 120.00, 'Elegant clear glass bottle with a screw cap, ideal for eau de parfum.', '2026-06-15 10:00:00', '2026-06-15 10:00:00'),
('Frosted Amber Bottle', 'https://example.com/images/bottles/frosted-amber.jpg', 80, 100, 180.50, 'Frosted amber glass bottle that protects fragrance from light.', '2026-06-16 11:30:00', '2026-06-16 11:30:00'),
('Travel Spray Bottle', 'https://example.com/images/bottles/travel-spray.jpg', 200, 15, 45.00, 'Compact atomizer bottle perfect for travel and on-the-go use.', '2026-06-17 09:15:00', '2026-06-17 09:15:00'),
('Luxury Crystal Bottle', 'https://example.com/images/bottles/luxury-crystal.jpg', 30, 75, 350.00, 'Premium crystal-cut bottle designed for limited edition perfumes.', '2026-06-18 14:20:00', '2026-06-18 14:20:00'),
('Matte Black Bottle', 'https://example.com/images/bottles/matte-black.jpg', 150, 50, 130.00, 'Sleek matte black bottle with a modern minimalist design.', '2026-06-19 16:00:00', '2026-06-19 16:00:00'),
('Rose Gold Cap Bottle', 'https://example.com/images/bottles/rose-gold-cap.jpg', 90, 60, 160.00, 'Clear glass bottle featuring a rose gold cap for a feminine touch.', '2026-06-20 08:45:00', '2026-06-20 08:45:00'),
('Refill Pouch Bottle', 'https://example.com/images/bottles/refill-pouch.jpg', 120, 200, 90.00, 'Eco-friendly refill pouch bottle for bulk fragrance storage.', '2026-06-21 12:10:00', '2026-06-21 12:10:00'),
('Vintage Square Bottle', 'https://example.com/images/bottles/vintage-square.jpg', 60, 50, 140.00, 'Retro-inspired square bottle with textured glass finish.', '2026-06-22 15:30:00', '2026-06-22 15:30:00'),
('Mini Sample Bottle', 'https://example.com/images/bottles/mini-sample.jpg', 300, 5, 15.00, 'Small sample-size bottle used for perfume testers.', '2026-06-23 10:50:00', '2026-06-23 10:50:00'),
('Gift Set Bottle', 'https://example.com/images/bottles/gift-set.jpg', 50, 30, 100.00, 'Decorative bottle designed for holiday and gift set packaging.', '2026-06-24 17:00:00', '2026-06-24 17:00:00'),
('Eco Recycled Glass Bottle', 'https://example.com/images/bottles/eco-recycled.jpg', 70, 100, 110.00, 'Made from recycled glass, sustainable and stylish.', '2026-06-25 09:40:00', '2026-06-25 09:40:00');


-- Changes --

ALTER TABLE customers 
MODIFY COLUMN password VARCHAR(255) NULL;


ALTER TABLE customers 
ADD COLUMN google_id VARCHAR(255) NULL;


ALTER TABLE customers 
ADD COLUMN profile_pic VARCHAR(255) NULL;

ALTER TABLE customers
DROP COLUMN address;

-- selection --

select * from customers;
select * from orders;
select * from order_items;
select * from product_images;
select* from ratings;
select * from products;
select * from offers;
select * from product_offers;
select * from sessions;
select *from product_variants;
select * from bottles;

-- Admin Info Table --

CREATE TABLE admin_info (
  id INT PRIMARY KEY AUTO_INCREMENT,
  admin_email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed first admin (run seed_admin.js to insert with hashed password)
