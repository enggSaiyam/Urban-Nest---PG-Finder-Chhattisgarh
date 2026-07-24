-- ============================================================
-- Urban Nest - Sample Seed Data (MySQL)
-- Run schema.sql first before running this file
-- Default password for all demo accounts: password123
-- ============================================================
USE urban_nest;

-- Password hash is SHA-256 of "password123urban-nest-salt"
-- In your Node.js app: createHash('sha256').update(password + 'urban-nest-salt').digest('hex')
SET @pw = '80d7c95438d580672da65b55dbde9735dce7b1534e3ccecf0a50afb95e3e1e24';

-- -------------------------------------------------------
-- Sample Users
-- -------------------------------------------------------
INSERT INTO users (name, email, password_hash, phone, role) VALUES
('Rajesh Kumar Sharma', 'rajesh@urban-nest.in', @pw, '9876543210', 'owner'),
('Priya Verma', 'priya@urban-nest.in', @pw, '9765432109', 'owner'),
('Amit Singh Thakur', 'amit@urban-nest.in', @pw, '9654321098', 'owner'),
('Sunita Patel', 'sunita@urban-nest.in', @pw, '9543210987', 'owner'),
('Mahesh Chandrakar', 'mahesh@urban-nest.in', @pw, '9432109876', 'owner'),
('Demo Owner', 'owner@demo.com', @pw, '9755376105', 'owner'),
('Rahul Mishra', 'rahul@urban-nest.in', @pw, '8876543210', 'tenant'),
('Anjali Gupta', 'anjali@urban-nest.in', @pw, '8765432109', 'tenant'),
('Demo Tenant', 'tenant@demo.com', @pw, '9755376104', 'tenant');

-- -------------------------------------------------------
-- Sample PG Listings
-- -------------------------------------------------------
INSERT INTO pgs (name, city, address, description, rent, pg_type, gender, total_rooms, available_rooms, amenities, images, owner_id) VALUES
('Shree Ram PG','Raipur','Near NIT, Tatibandh, Raipur','Well-furnished PG with all modern amenities near NIT Raipur.',6500,'pg','male',20,5,'["WiFi","Meals","Laundry","CCTV","Security Guard"]','["https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800"]',1),
('Green Valley Girls Hostel','Raipur','Pandri, Near Bata Chowk, Raipur','Safe girls hostel with home-cooked meals and 24/7 security.',7200,'hostel','female',30,8,'["WiFi","Meals","CCTV","Security Guard","Geyser","Laundry"]','["https://images.unsplash.com/photo-1586105251261-72a756497a11?w=800"]',2),
('City Living PG','Raipur','Shankar Nagar, Raipur','Affordable PG in the heart of Raipur.',5500,'pg','any',15,3,'["WiFi","Parking","CCTV","Water Purifier"]','["https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800"]',3),
('Royal Comfort PG','Raipur','Telibandha, Raipur','Premium PG with fully furnished rooms, gym access, and rooftop terrace.',9500,'pg','any',12,2,'["WiFi","AC","Meals","Gym","Parking","CCTV","Geyser","Security Guard","TV"]','["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"]',5),
('Student Paradise PG','Bilaspur','Near CSPGCL, Sarkanda, Bilaspur','Comfortable PG near major offices and educational institutes.',5000,'pg','male',18,7,'["WiFi","Meals","CCTV","Water Purifier","Laundry"]','["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"]',1),
('Steel City PG','Bhilai','Sector 6, Bhilai','Well-located PG near BSP (Bhilai Steel Plant).',6000,'pg','any',22,6,'["WiFi","Parking","CCTV","Geyser","Water Purifier","Security Guard"]','["https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800"]',1),
('Power City PG','Korba','Transport Nagar, Korba','Well-maintained PG near NTPC and CSEB offices.',5500,'pg','any',16,5,'["WiFi","Parking","CCTV","Geyser","Water Purifier"]','["https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800"]',4),
('Bastar Heritage PG','Jagdalpur','Near Engineering College, Jagdalpur','Budget hostel for students and tribal welfare workers.',4000,'pg','any',20,9,'["WiFi","Meals","CCTV","Water Purifier","TV"]','["https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800"]',3);

-- -------------------------------------------------------
-- Sample Complaint
-- -------------------------------------------------------
INSERT INTO complaints (complainant_id, pg_id, subject, description, category, status) VALUES
(7, 1, 'WiFi frequently disconnects', 'The WiFi at the PG keeps disconnecting every few hours and the issue has been ongoing for 2 weeks without resolution from the owner.', 'maintenance', 'pending');
