-- ============================================================
-- UrbanServe: INSERT new additional services
-- Run via: Get-Content ... | mysql -u root -pharsh1234 urbanserve
-- ============================================================

USE urbanserve;

-- ── NEW: AC & Appliance (category_id = 1) ────────────────────
INSERT INTO services (name, category_id, price, duration, description, image_url, rating, total_reviews) VALUES
('IcePure AC Deep Clean', 1, 399, 60,
 'Standalone deep-clean service for split ACs — high-pressure foam wash of evaporator fins, blower fan blades, and drain tray. Removes 99% of mold, bacteria, and allergens. No disassembly of walls. Safe for all brands. Dries in under 30 minutes.',
 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?w=600', 4.7, 1120),

-- ── NEW: Cleaning (category_id = 2) ─────────────────────────
('CrystalPane Glass & Window Clean', 2, 599, 90,
 'Professional exterior and interior window, glass door, and mirror cleaning using squeegee technique and streak-free solution. Covers all floors of apartments (up to 3rd floor from outside). Removes hard water stains, grime, and dry paint splatters.',
 'https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?w=600', 4.6, 870),

-- ── NEW: Plumbing (category_id = 3) ─────────────────────────
('DrainClear Blockage Removal', 3, 349, 45,
 'Unblock stubborn drain and sewer clogs using high-pressure hydro-jet or manual snake auger. Covers kitchen sink, bathroom floor trap, wash basin, and bathtub drains. Foul smell treatment included. 72-hour re-service guarantee if the blockage returns.',
 'https://images.unsplash.com/photo-1599686090862-8912b1e26ac9?w=600', 4.5, 1340),

-- ── NEW: Electrical (category_id = 4) ───────────────────────
('BrightFit LED Lighting Setup', 4, 499, 90,
 'End-to-end LED lighting installation — false ceiling strip lights, recessed downlights, pendant light wiring, and smart bulb/dimmer switch setup. Covers new installations and existing fixture replacements. All wiring concealed and junction boxes fitted.',
 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=600', 4.8, 640),

-- ── NEW: Carpentry (category_id = 5) ────────────────────────
('ShelfRight Wall Shelf Install', 5, 299, 60,
 'Drill, plug, and mount wall shelves, floating racks, TV brackets, curtain rods, and photo frames on any wall type — concrete, gypsum, or hollow brick. Load rating confirmed before mounting. Clean drilling with anti-dust guard. Covers up to 5 mounting points per visit.',
 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600', 4.6, 920),

-- ── NEW: Painting (category_id = 6) ─────────────────────────
('TexturePro Wall Texture Finish', 6, 4499, 600,
 'Create stunning textured feature walls using sand texture, rough plaster, stucco, or Venetian plaster finish. Includes base coat preparation, texture application, and a sealing top coat. Available in over 20 pattern styles. Transforms accent walls, foyers, and living room backdrops.',
 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600', 4.7, 310),

-- ── NEW: Pest Control (category_id = 7) ─────────────────────
('BedBugOut Heat Treatment', 7, 2499, 240,
 'Chemical-free thermal heat treatment for bed bug elimination — room temperature raised to 55°C using industrial heaters, killing bed bugs and eggs at all life stages. No vacating required for more than 4 hours. Covers mattress, bed frame, wardrobes, and skirting. 6-month warranty.',
 'https://images.unsplash.com/photo-1629046878823-ba17e9d2e2e7?w=600', 4.9, 450),

-- ── NEW: Beauty & Wellness (category_id = 8) ────────────────
('ZenTouch Full Body Massage', 8, 899, 90,
 'Relaxing full-body Swedish or deep-tissue massage at your home by a certified therapist. Uses aromatherapy oils, heated towels, and a professional foldable massage table. Covers back, shoulders, arms, legs, and feet. Choose from relaxation, pain-relief, or sports recovery styles.',
 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600', 4.9, 2150);
