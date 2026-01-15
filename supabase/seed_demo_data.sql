-- 1. PROMOTE YOURSELF TO ADMIN
-- Run this to give your current account admin rights
-- Replace 'your-email@example.com' with the email you signed up with
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';


-- 2. INSERT DEMO EXPORTERS
-- This script inserts 3 professional demo exporters for testing.
-- Note: These are tied to a "system" user. 

DO $$
DECLARE
    system_user_id UUID;
BEGIN
    -- Only run if you want to see data in the admin panel and marketplace
    -- Note: In a real app, these would be real signed-up users.
    
    -- Check if we have at least one user to link these to, or create a 'demo' user entry
    -- For simplicity, we assume you want to see them in the tables.
    
    INSERT INTO exporter_profiles (company_name, country, city, products, moq, moq_unit, description, verified)
    VALUES 
    ('Himalayan Spice Co.', 'India', 'Dehradun', ARRAY['Organic Turmeric', 'Black Pepper', 'Cinnamon'], 100, 'kg', 'Premium organic spices sourced directly from high-altitude farmers in the Himalayas.', true),
    
    ('Surat Textile Hub', 'India', 'Surat', ARRAY['Silk Sarees', 'Cotton Fabrics', 'Designer Suits'], 50, 'meters', 'Leading manufacturer of traditional Indian textiles since 1995. Global shipping available.', false),
    
    ('Indus Leather Goods', 'India', 'Kanpur', ARRAY['Leather Jackets', 'Belts', 'Handbags'], 20, 'pieces', 'Eco-friendly genuine leather products with modern designs for international markets.', true);

END $$;
