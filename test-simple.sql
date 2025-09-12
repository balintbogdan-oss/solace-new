-- Simple test to insert one client
INSERT INTO clients (id, first_name, last_name, email, phone) VALUES
(gen_random_uuid(), 'Test', 'User', 'test@example.com', '+1-555-9999');
