-- Test insert to see if we can add data safely
INSERT INTO clients (id, first_name, last_name, email, phone) VALUES
(gen_random_uuid(), 'Test', 'User', 'test@example.com', '+1-555-9999');
