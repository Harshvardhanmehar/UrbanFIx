-- ============================================================
-- UrbanServe: Live UPDATE script — Names, Images, Descriptions
-- Run: mysql -u root -pharsh1234 urbanserve < update_services.sql
-- ============================================================

USE urbanserve;

-- ── AC & Appliance (category_id = 1) ────────────────────────

-- Row 1: AC Service & Repair
UPDATE services SET
  name        = 'CoolBreeze AC Tune-Up',
  image_url   = 'https://images.unsplash.com/photo-1625979628804-e2517a1ffe82?w=600',
  description = 'Full AC health check and tune-up — deep evaporator coil cleaning, refrigerant pressure test, gas top-up if needed, condenser wash, thermostat calibration, and drainage flush. Covers all major split and window AC brands. ISI-certified technicians only.'
WHERE name = 'AC Service & Repair';

-- Row 2: AC Installation
UPDATE services SET
  name        = 'FrostFit AC Installation',
  image_url   = 'https://images.unsplash.com/photo-1694429460839-b3bdb08e7555?w=600',
  description = 'End-to-end split or window AC installation — wall bracket mounting, copper pipe laying and flaring, electrical load assessment, indoor-outdoor unit pairing, and a full post-install cooling test. Senior technician inspection guaranteed before sign-off.'
WHERE name = 'AC Installation';

-- Row 3: Washing Machine Repair
UPDATE services SET
  name        = 'SpinCycle Washer Fix',
  image_url   = 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600',
  description = 'Diagnose and fix fully automatic and semi-automatic washing machines — drum bearing failure, motor burnout, PCB faults, door lock errors, spin-cycle problems, and water inlet/drain blockages. Covers Samsung, LG, Whirlpool, Bosch, and all major brands, with a 60-day repair warranty.'
WHERE name = 'Washing Machine Repair';

-- Row 4: Refrigerator Repair
UPDATE services SET
  name        = 'ChillGuard Fridge Repair',
  image_url   = 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=600',
  description = 'Same-day refrigerator repair by factory-trained engineers — covers compressor failure, cooling not working, ice maker faults, water dispenser issues, door gasket replacement, frost buildup, and thermostat recalibration. Single, double, and multi-door models supported.'
WHERE name = 'Refrigerator Repair';


-- ── Cleaning (category_id = 2) ──────────────────────────────

-- Row 5: Home Deep Cleaning
UPDATE services SET
  name        = 'PureHome Full-House Deep Clean',
  image_url   = 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600',
  description = 'Top-to-bottom deep clean of your entire home. Includes kitchen degreasing, bathroom tile scrubbing and descaling, bedroom and living area dry vacuuming, ceiling fan blade wipe-down, switchboard and AC vent cleaning, and final mopping with hospital-grade eco-safe disinfectants.'
WHERE name = 'Home Deep Cleaning';

-- Row 6: Kitchen Cleaning
UPDATE services SET
  name        = 'GleamKitchen Deep Scrub',
  image_url   = 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600',
  description = 'Intensive kitchen-only deep clean — chimney baffle filter degreasing, gas stove burner head scrub, oil-caked wall tile steam-cleaning, modular cabinet interior wipe-down, countertop polish, sink and drain sanitization. Leaves zero grease and no chemical residue.'
WHERE name = 'Kitchen Cleaning';

-- Row 7: Bathroom Cleaning
UPDATE services SET
  name        = 'ShineShield Bathroom Sanitize',
  image_url   = 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600',
  description = 'Professional bathroom sanitization — toilet bowl descaling and disinfecting, floor tile scrubbing, wall tile stain removal, grout cleaning, exhaust fan blade cleaning, mirror polishing, soap dish and tap descaling, and drain deodorizing. Leaves every surface spotless and germ-free.'
WHERE name = 'Bathroom Cleaning';

-- Row 8: Sofa & Carpet Cleaning
UPDATE services SET
  name        = 'SoftTouch Upholstery Steam Clean',
  image_url   = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600',
  description = 'Hot-water extraction and steam cleaning for fabric sofas, L-shaped sectionals, accent chairs, area rugs, and wall-to-wall carpets. Removes deep-set stains, pet dander, dust mites, mold spores, and lingering odours. Safe for microfibre, velvet, jute, and wool. Dries in 4–6 hours.'
WHERE name = 'Sofa & Carpet Cleaning';


-- ── Plumbing (category_id = 3) ──────────────────────────────

-- Row 9: Pipe Leak Repair
UPDATE services SET
  name        = 'LeakStop Pipe Repair',
  image_url   = 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600',
  description = 'Rapid detection and repair of visible or hidden pipe leaks — burst joints, seepage through walls, under-slab leaks, and supply line cracks. Our plumbers use pressure-tested CPVC fittings and epoxy sealants with a 30-day workmanship guarantee. Available same day.'
WHERE name = 'Pipe Leak Repair';

-- Row 10: Tap & Faucet Repair
UPDATE services SET
  name        = 'Drip-Free Tap & Mixer Fix',
  image_url   = 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600',
  description = 'Repair or replace dripping taps, ceramic-disc single-lever mixers, wall-mounted concealed faucets, pull-out kitchen taps, and sensor taps. Includes new ceramic cartridge or washer fitment. Covers all popular brands — Jaquar, Kohler, Cera, Parryware, and more.'
WHERE name = 'Tap & Faucet Repair';

-- Row 11: Toilet Repair & Flush
UPDATE services SET
  name        = 'FlushPro Toilet Repair',
  image_url   = 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600',
  description = 'Comprehensive toilet repair service — fix running cistern, replace broken flush valve diaphragm and fill valve, repair slow-fill tanks, replace cracked toilet seat, check WC base seal for leaks, and deodorize. Compatible with Western, wall-hung, and smart toilet models.'
WHERE name = 'Toilet Repair & Flush';

-- Row 12: Water Heater Installation
UPDATE services SET
  name        = 'HeatWave Geyser Install',
  image_url   = 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=600',
  description = 'Supply and professional installation of storage geysers (6L–25L) or instant water heaters. Includes wall mounting, CPVC inlet-outlet connections, safety pressure relief valve fitting, earthing, and a full hot-water pressure test. Works with Racold, Havells, AO Smith, V-Guard, and more.'
WHERE name = 'Water Heater Installation';


-- ── Electrical (category_id = 4) ────────────────────────────

-- Row 13: Electrical Wiring & Repair
UPDATE services SET
  name        = 'SafeWire Electrical Repair',
  image_url   = 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600',
  description = 'ISI-certified electricians handle all wiring faults — tracing short circuits, replacing damaged cables, adding new DB circuits, extending wiring to new rooms, and replacing modular switches and sockets. All work tested with a clamp meter and insulation resistance tester before handover.'
WHERE name = 'Electrical Wiring & Repair';

-- Row 14: Fan Installation
UPDATE services SET
  name        = 'BreezeMount Ceiling Fan Setup',
  image_url   = 'https://images.unsplash.com/photo-1540496905036-5937c10647cc?w=600',
  description = 'Professional ceiling fan installation or replacement — ceiling hook/rod fitting, capacitor and regulator wiring, blade attachment and balance check, speed test at all levels, and earthing verification. Supports all sizes (900mm–1400mm sweep) and brands including Orient, Havells, and Crompton.'
WHERE name = 'Fan Installation';

-- Row 15: MCB & Switchboard Repair
UPDATE services SET
  name        = 'PowerGuard MCB & Board Fix',
  image_url   = 'https://images.unsplash.com/photo-1555664090-a54a5736f0b0?w=600',
  description = 'Safe diagnosis and repair of tripping MCBs, RCCBs, dead power outlets, sparking sockets, loose bus bars, and fully damaged modular switchboards. Licensed electricians use insulated tools and a thermal camera to detect hot spots. Post-repair load test included.'
WHERE name = 'MCB & Switchboard Repair';

-- Row 16: CCTV Installation
UPDATE services SET
  name        = 'SecureEye CCTV Setup',
  image_url   = 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600',
  description = 'Complete CCTV surveillance setup — 2MP/4MP/8MP HD camera mounting at optimal angles, coaxial or Cat6 cable routing, DVR/NVR configuration, 1TB/2TB HDD setup, remote mobile viewing via app, and IR night-vision testing. Covers homes, apartments, shops, and small offices.'
WHERE name = 'CCTV Installation';


-- ── Carpentry (category_id = 5) ─────────────────────────────

-- Row 17: Door & Window Repair
UPDATE services SET
  name        = 'WoodCraft Door & Frame Fix',
  image_url   = 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600',
  description = 'Fix warped or sticking doors, broken hinges, loose door frames, faulty window handles, worn-out door closers, and damaged latches. Also covers wooden partition panel repairs and teak/veneer surface touch-ups. All hardware is ISI-grade and colour-matched to existing finish.'
WHERE name = 'Door & Window Repair';

-- Row 18: Furniture Assembly
UPDATE services SET
  name        = 'FlatPack Furniture Assembly',
  image_url   = 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600',
  description = 'Expert assembly of flat-pack and ready-to-assemble (RTA) furniture — beds, king/queen wardrobes, study and gaming desks, bookshelves, TV units, storage ottomans, and dining tables. Follows manufacturer instructions precisely. Suitable for IKEA, Pepperfry, Urban Ladder, Durian, and any branded kit.'
WHERE name = 'Furniture Assembly';


-- ── Painting (category_id = 6) ──────────────────────────────

-- Row 19: Interior Wall Painting
UPDATE services SET
  name        = 'EvercoatPro Interior Painting',
  image_url   = 'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=600',
  description = 'Premium interior wall and ceiling painting with full prep work — surface sanding, crack filling with white-cement putty, one primer coat, and two finish coats of Royale/Tractor emulsion. Fixtures and furniture masked before painting. Shade card consultation and colour sampling included. Full site cleanup on completion.'
WHERE name = 'Interior Wall Painting';

-- Row 20: Waterproofing
UPDATE services SET
  name        = 'DrySeal Waterproofing Treatment',
  image_url   = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600',
  description = 'Long-lasting waterproofing for terraces, external walls, wet bathrooms, and basement slabs. Uses polymer-modified cementitious coating or crystalline waterproofing compound depending on surface type. Application done in two coats with mesh embedding. Backed by a 5-year workmanship warranty and signed water test report.'
WHERE name = 'Waterproofing';


-- ── Pest Control (category_id = 7) ──────────────────────────

-- Row 21: Cockroach Control
UPDATE services SET
  name        = 'RoachOut Gel Treatment',
  image_url   = 'https://images.unsplash.com/photo-1632923057155-dd35e6a86fb3?w=600',
  description = 'Targeted, odourless gel-bait treatment to eliminate cockroach infestations at the source. Applied inside kitchen cabinets, under appliances, around drainage pipes, and in wall crevices. Gel is child-safe and pet-safe. No need to vacate your home. Includes a free 3-month follow-up re-treatment if cockroaches return.'
WHERE name = 'Cockroach Control';

-- Row 22: Termite Treatment
UPDATE services SET
  name        = 'TermiShield Anti-Termite Defense',
  image_url   = 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600',
  description = 'Comprehensive anti-termite treatment using WHO-approved termiticide — soil injection drilling around foundation, wood surface spray, and sub-slab injection where required. Covers both subterranean (ground) and dry-wood termites. Licensed pest control operators. Includes a detailed inspection report and 1-year conditional warranty.'
WHERE name = 'Termite Treatment';


-- ── Beauty & Wellness (category_id = 8) ─────────────────────

-- Row 23: Haircut & Styling (Men)
UPDATE services SET
  name        = 'SharpEdge Men''s Grooming',
  image_url   = 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600',
  description = 'Professional men''s grooming at your doorstep — precision scissor/machine haircut, shampoo and conditioning wash, blow-dry and styling, neck line and sideburn shave with a straight razor, and a refreshing cold towel finish. Tools are sterilized before every session. Zero mess — all cleanup handled by the barber.'
WHERE name = 'Haircut & Styling (Men)';

-- Row 24: Facial & Cleanup (Women)
UPDATE services SET
  name        = 'GlowUp Women''s Facial & Cleanup',
  image_url   = 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600',
  description = 'Luxurious at-home facial and deep skin cleanup using dermatologist-tested, branded skincare. Steps include double cleanse, gentle exfoliation, steam therapy, blackhead and whitehead extractions, calming face mask, toning, and SPF moisturizer finish. Customized for dry, oily, combination, or sensitive skin types.'
WHERE name = 'Facial & Cleanup (Women)';
