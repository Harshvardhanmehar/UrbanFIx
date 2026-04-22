-- ============================================
-- UrbanServe - Database Schema
-- ============================================

CREATE DATABASE IF NOT EXISTS urbanserve;
USE urbanserve;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role ENUM('user', 'admin') DEFAULT 'user',
  avatar VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Service Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Services Table
CREATE TABLE IF NOT EXISTS services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  category_id INT,
  price DECIMAL(10, 2) NOT NULL,
  duration INT DEFAULT 60,         -- duration in minutes
  description TEXT,
  image_url VARCHAR(255),
  rating DECIMAL(3,2) DEFAULT 4.5,
  total_reviews INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  service_id INT NOT NULL,
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  address TEXT NOT NULL,
  status ENUM('pending', 'confirmed', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
  notes TEXT,
  total_amount DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
);

-- ============================================
-- Seed Data
-- ============================================

-- Insert Categories
INSERT INTO categories (name, icon) VALUES
('AC & Appliance', 'air-conditioner'),
('Cleaning', 'broom'),
('Plumbing', 'wrench'),
('Electrical', 'bolt'),
('Carpentry', 'hammer'),
('Painting', 'paint-brush'),
('Pest Control', 'bug'),
('Beauty & Wellness', 'spa');

-- Insert Services
INSERT INTO services (name, category_id, price, duration, description, image_url, rating, total_reviews) VALUES
-- AC & Appliance
('CoolBreeze AC Tune-Up', 1, 599, 90, 'Full AC health check and tune-up — deep evaporator coil cleaning, refrigerant pressure test, gas top-up if needed, condenser wash, thermostat calibration, and drainage flush. Covers all major split and window AC brands. ISI-certified technicians only.', 'https://images.unsplash.com/photo-1625979628804-e2517a1ffe82?w=600', 4.8, 2340),
('FrostFit AC Installation', 1, 1199, 120, 'End-to-end split or window AC installation — wall bracket mounting, copper pipe laying and flaring, electrical load assessment, indoor-outdoor unit pairing, and a full post-install cooling test. Senior technician inspection guaranteed before sign-off.', 'https://images.unsplash.com/photo-1694429460839-b3bdb08e7555?w=600', 4.7, 1890),
('SpinCycle Washer Fix', 1, 499, 75, 'Diagnose and fix fully automatic and semi-automatic washing machines — drum bearing failure, motor burnout, PCB faults, door lock errors, spin-cycle problems, and water inlet/drain blockages. Covers Samsung, LG, Whirlpool, Bosch, and all major brands with a 60-day repair warranty.', 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600', 4.6, 1230),
('ChillGuard Fridge Repair', 1, 449, 60, 'Same-day refrigerator repair by factory-trained engineers — covers compressor failure, cooling not working, ice maker faults, water dispenser issues, door gasket replacement, frost buildup, and thermostat recalibration. Single, double, and multi-door models supported.', 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=600', 4.5, 980),

-- Cleaning
('PureHome Full-House Deep Clean', 2, 1499, 240, 'Top-to-bottom deep clean of your entire home. Includes kitchen degreasing, bathroom tile scrubbing and descaling, bedroom and living area dry vacuuming, ceiling fan blade wipe-down, switchboard and AC vent cleaning, and final mopping with hospital-grade eco-safe disinfectants.', 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600', 4.9, 3450),
('GleamKitchen Deep Scrub', 2, 799, 120, 'Intensive kitchen-only deep clean — chimney baffle filter degreasing, gas stove burner head scrub, oil-caked wall tile steam-cleaning, modular cabinet interior wipe-down, countertop polish, sink and drain sanitization. Leaves zero grease and no chemical residue.', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600', 4.7, 2100),
('ShineShield Bathroom Sanitize', 2, 499, 90, 'Professional bathroom sanitization — toilet bowl descaling and disinfecting, floor tile scrubbing, wall tile stain removal, grout cleaning, exhaust fan blade cleaning, mirror polishing, soap dish and tap descaling, and drain deodorizing. Leaves every surface spotless and germ-free.', 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600', 4.6, 1750),
('SoftTouch Upholstery Steam Clean', 2, 699, 120, 'Hot-water extraction and steam cleaning for fabric sofas, L-shaped sectionals, accent chairs, area rugs, and wall-to-wall carpets. Removes deep-set stains, pet dander, dust mites, mold spores, and lingering odours. Safe for microfibre, velvet, jute, and wool. Dries in 4–6 hours.', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600', 4.8, 1560),

-- Plumbing
('LeakStop Pipe Repair', 3, 299, 60, 'Rapid detection and repair of visible or hidden pipe leaks — burst joints, seepage through walls, under-slab leaks, and supply line cracks. Our plumbers use pressure-tested CPVC fittings and epoxy sealants with a 30-day workmanship guarantee. Available same day.', 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600', 4.5, 890),
('Drip-Free Tap & Mixer Fix', 3, 199, 45, 'Repair or replace dripping taps, ceramic-disc single-lever mixers, wall-mounted concealed faucets, pull-out kitchen taps, and sensor taps. Includes new ceramic cartridge or washer fitment. Covers all popular brands — Jaquar, Kohler, Cera, Parryware, and more.', 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600', 4.6, 1200),
('FlushPro Toilet Repair', 3, 349, 60, 'Comprehensive toilet repair service — fix running cistern, replace broken flush valve diaphragm and fill valve, repair slow-fill tanks, replace cracked toilet seat, check WC base seal for leaks, and deodorize. Compatible with Western, wall-hung, and smart toilet models.', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600', 4.4, 670),
('HeatWave Geyser Install', 3, 799, 90, 'Supply and professional installation of storage geysers (6L–25L) or instant water heaters. Includes wall mounting, CPVC inlet-outlet connections, safety pressure relief valve fitting, earthing, and a full hot-water pressure test. Works with Racold, Havells, AO Smith, V-Guard, and more.', 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=600', 4.7, 540),

-- Electrical
('SafeWire Electrical Repair', 4, 399, 60, 'ISI-certified electricians handle all wiring faults — tracing short circuits, replacing damaged cables, adding new DB circuits, extending wiring to new rooms, and replacing modular switches and sockets. All work tested with a clamp meter and insulation resistance tester before handover.', 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600', 4.7, 1450),
('BreezeMount Ceiling Fan Setup', 4, 249, 45, 'Professional ceiling fan installation or replacement — ceiling hook/rod fitting, capacitor and regulator wiring, blade attachment and balance check, speed test at all levels, and earthing verification. Supports all sizes (900mm–1400mm sweep) and brands including Orient, Havells, and Crompton.', 'https://images.unsplash.com/photo-1540496905036-5937c10647cc?w=600', 4.6, 980),
('PowerGuard MCB & Board Fix', 4, 349, 60, 'Safe diagnosis and repair of tripping MCBs, RCCBs, dead power outlets, sparking sockets, loose bus bars, and fully damaged modular switchboards. Licensed electricians use insulated tools and a thermal camera to detect hot spots. Post-repair load test included.', 'https://images.unsplash.com/photo-1555664090-a54a5736f0b0?w=600', 4.5, 760),
('SecureEye CCTV Setup', 4, 1499, 180, 'Complete CCTV surveillance setup — 2MP/4MP/8MP HD camera mounting at optimal angles, coaxial or Cat6 cable routing, DVR/NVR configuration, 1TB/2TB HDD setup, remote mobile viewing via app, and IR night-vision testing. Covers homes, apartments, shops, and small offices.', 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600', 4.8, 430),

-- Carpentry
('WoodCraft Door & Frame Fix', 5, 499, 90, 'Fix warped or sticking doors, broken hinges, loose door frames, faulty window handles, worn-out door closers, and damaged latches. Also covers wooden partition panel repairs and teak/veneer surface touch-ups. All hardware is ISI-grade and colour-matched to existing finish.', 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600', 4.5, 670),
('FlatPack Furniture Assembly', 5, 399, 120, 'Expert assembly of flat-pack and ready-to-assemble (RTA) furniture — beds, king/queen wardrobes, study and gaming desks, bookshelves, TV units, storage ottomans, and dining tables. Follows manufacturer instructions precisely. Suitable for IKEA, Pepperfry, Urban Ladder, Durian, and any branded kit.', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600', 4.7, 890),

-- Painting
('EvercoatPro Interior Painting', 6, 2999, 480, 'Premium interior wall and ceiling painting with full prep work — surface sanding, crack filling with white-cement putty, one primer coat, and two finish coats of Royale/Tractor emulsion. Fixtures and furniture masked before painting. Shade card consultation and colour sampling included. Full site cleanup on completion.', 'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=600', 4.8, 1230),
('DrySeal Waterproofing Treatment', 6, 3999, 360, 'Long-lasting waterproofing for terraces, external walls, wet bathrooms, and basement slabs. Uses polymer-modified cementitious coating or crystalline waterproofing compound depending on surface type. Application done in two coats with mesh embedding. Backed by a 5-year workmanship warranty and signed water test report.', 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600', 4.7, 560),

-- Pest Control
('RoachOut Gel Treatment', 7, 599, 90, 'Targeted, odourless gel-bait treatment to eliminate cockroach infestations at the source. Applied inside kitchen cabinets, under appliances, around drainage pipes, and in wall crevices. Gel is child-safe and pet-safe. No need to vacate your home. Includes a free 3-month follow-up re-treatment if cockroaches return.', 'https://images.unsplash.com/photo-1632923057155-dd35e6a86fb3?w=600', 4.6, 2100),
('TermiShield Anti-Termite Defense', 7, 1999, 180, 'Comprehensive anti-termite treatment using WHO-approved termiticide — soil injection drilling around foundation, wood surface spray, and sub-slab injection where required. Covers both subterranean (ground) and dry-wood termites. Licensed pest control operators. Includes a detailed inspection report and 1-year conditional warranty.', 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600', 4.8, 780),

-- Beauty & Wellness
('SharpEdge Men''s Grooming', 8, 299, 45, 'Professional men''s grooming at your doorstep — precision scissor/machine haircut, shampoo and conditioning wash, blow-dry and styling, neck line and sideburn shave with a straight razor, and a refreshing cold towel finish. Tools are sterilized before every session. Zero mess — all cleanup handled by the barber.', 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600', 4.9, 3400),
('GlowUp Women''s Facial & Cleanup', 8, 599, 75, 'Luxurious at-home facial and deep skin cleanup using dermatologist-tested, branded skincare. Steps include double cleanse, gentle exfoliation, steam therapy, blackhead and whitehead extractions, calming face mask, toning, and SPF moisturizer finish. Customized for dry, oily, combination, or sensitive skin types.', 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600', 4.8, 2800);

-- Insert Admin User (password: Admin@123)
INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@urbanserve.com', '$2b$10$rQZ9Phe7bvf7E8TBMk8GiOvQk8nFQR0HxF5mWEX5KMd5X5Kqx5K5i', 'admin');
