-- =================================================================
-- UrbanServe: Database Cleanup — remove duplicate categories & orphan services
-- =================================================================

USE urbanserve;

-- Step 1: Point all services using duplicate category IDs back to the canonical ones (1-8)
UPDATE services SET category_id = 1 WHERE category_id IN (9,17,25,33,41,49);
UPDATE services SET category_id = 2 WHERE category_id IN (10,18,26,34,42,50);
UPDATE services SET category_id = 3 WHERE category_id IN (11,19,27,35,43,51);
UPDATE services SET category_id = 4 WHERE category_id IN (12,20,28,36,44,52);
UPDATE services SET category_id = 5 WHERE category_id IN (13,21,29,37,45,53);
UPDATE services SET category_id = 6 WHERE category_id IN (14,22,30,38,46,54);
UPDATE services SET category_id = 7 WHERE category_id IN (15,23,31,39,47,55);
UPDATE services SET category_id = 8 WHERE category_id IN (16,24,32,40,48,56);

-- Step 2: Delete all duplicate categories (keep only IDs 1-8)
DELETE FROM categories WHERE id > 8;

-- Step 3: Delete duplicate services — keep only the first 32 (IDs 1-24 original + 25-32 new)
--   The first 24 are our updated originals. IDs 25-32 are the 8 new ones we added.
--   Everything above that is a duplicate from re-seeding.
DELETE FROM services WHERE id > 32;

-- Step 4: Verify
SELECT 'Categories remaining:' AS info, COUNT(*) AS count FROM categories;
SELECT 'Services remaining:' AS info, COUNT(*) AS count FROM services;
