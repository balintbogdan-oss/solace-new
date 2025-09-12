-- Populate search data with 10 clients and 2-5 accounts each
-- This script creates realistic client and account data for testing the search functionality

-- Clear existing data (optional - uncomment if you want to start fresh)
-- DELETE FROM account_balances WHERE account_id IN (SELECT account_id FROM accounts);
-- DELETE FROM accounts;
-- DELETE FROM households;
-- DELETE FROM clients;

-- Insert 10 clients with auto-generated UUIDs
INSERT INTO clients (id, first_name, last_name, email, phone) VALUES
-- Married couple 1: Smith family
(gen_random_uuid(), 'John', 'Smith', 'john.smith@email.com', '+1-555-0101'),
(gen_random_uuid(), 'Sarah', 'Smith', 'sarah.smith@email.com', '+1-555-0102'),

-- Married couple 2: Johnson family
(gen_random_uuid(), 'Michael', 'Johnson', 'michael.johnson@email.com', '+1-555-0201'),
(gen_random_uuid(), 'Jennifer', 'Johnson', 'jennifer.johnson@email.com', '+1-555-0202'),

-- Single clients
(gen_random_uuid(), 'Robert', 'Williams', 'robert.williams@email.com', '+1-555-0301'),
(gen_random_uuid(), 'Emily', 'Davis', 'emily.davis@email.com', '+1-555-0401'),
(gen_random_uuid(), 'David', 'Brown', 'david.brown@email.com', '+1-555-0501'),
(gen_random_uuid(), 'Lisa', 'Wilson', 'lisa.wilson@email.com', '+1-555-0601'),

-- Married couple 3: Anderson family
(gen_random_uuid(), 'James', 'Anderson', 'james.anderson@email.com', '+1-555-0701'),
(gen_random_uuid(), 'Maria', 'Anderson', 'maria.anderson@email.com', '+1-555-0702');

-- Insert households with auto-generated UUIDs
INSERT INTO households (id, name, description) VALUES
(gen_random_uuid(), 'Smith Family', 'Primary household for John and Sarah Smith'),
(gen_random_uuid(), 'Johnson Family', 'Investment household for Michael and Jennifer Johnson'),
(gen_random_uuid(), 'Anderson Family Trust', 'Family trust management for James and Maria Anderson'),
(gen_random_uuid(), 'Williams Family Trust', 'Family trust management');

-- Insert accounts using subqueries to get the actual client and household IDs
INSERT INTO accounts (account_id, account_name, account_type, client_id, household_id, is_primary) VALUES
-- John Smith accounts (3 accounts: 2 in household, 1 individual)
('1PB10001', 'Smith Family Trust Account', 'trust', 
 (SELECT id FROM clients WHERE first_name = 'John' AND last_name = 'Smith' LIMIT 1),
 (SELECT id FROM households WHERE name = 'Smith Family' LIMIT 1), 
 true),

('1PB10002', 'John Smith Individual IRA', 'ira', 
 (SELECT id FROM clients WHERE first_name = 'John' AND last_name = 'Smith' LIMIT 1),
 (SELECT id FROM households WHERE name = 'Smith Family' LIMIT 1), 
 false),

('1PB10003', 'John Smith Personal Investment', 'individual', 
 (SELECT id FROM clients WHERE first_name = 'John' AND last_name = 'Smith' LIMIT 1),
 null, false),

-- Sarah Smith accounts (2 accounts: 1 in household, 1 individual)
('1PB10004', 'Sarah Smith Joint Account', 'joint', 
 (SELECT id FROM clients WHERE first_name = 'Sarah' AND last_name = 'Smith' LIMIT 1),
 (SELECT id FROM households WHERE name = 'Smith Family' LIMIT 1), 
 false),

('1PB10005', 'Sarah Smith Roth IRA', 'roth_ira', 
 (SELECT id FROM clients WHERE first_name = 'Sarah' AND last_name = 'Smith' LIMIT 1),
 null, true),

-- Michael Johnson accounts (4 accounts: 2 in household, 2 individual)
('1PB10006', 'Johnson Family Investment', 'joint', 
 (SELECT id FROM clients WHERE first_name = 'Michael' AND last_name = 'Johnson' LIMIT 1),
 (SELECT id FROM households WHERE name = 'Johnson Family' LIMIT 1), 
 true),

('1PB10007', 'Michael Johnson 401k', '401k', 
 (SELECT id FROM clients WHERE first_name = 'Michael' AND last_name = 'Johnson' LIMIT 1),
 (SELECT id FROM households WHERE name = 'Johnson Family' LIMIT 1), 
 false),

('1PB10008', 'Michael Johnson Trading Account', 'individual', 
 (SELECT id FROM clients WHERE first_name = 'Michael' AND last_name = 'Johnson' LIMIT 1),
 null, false),

('1PB10009', 'Michael Johnson Options Account', 'individual', 
 (SELECT id FROM clients WHERE first_name = 'Michael' AND last_name = 'Johnson' LIMIT 1),
 null, false),

-- Jennifer Johnson accounts (3 accounts: 1 in household, 2 individual)
('1PB10010', 'Jennifer Johnson SEP IRA', 'sep_ira', 
 (SELECT id FROM clients WHERE first_name = 'Jennifer' AND last_name = 'Johnson' LIMIT 1),
 (SELECT id FROM households WHERE name = 'Johnson Family' LIMIT 1), 
 false),

('1PB10011', 'Jennifer Johnson Business Account', 'corporate', 
 (SELECT id FROM clients WHERE first_name = 'Jennifer' AND last_name = 'Johnson' LIMIT 1),
 null, true),

('1PB10012', 'Jennifer Johnson Personal Trust', 'trust', 
 (SELECT id FROM clients WHERE first_name = 'Jennifer' AND last_name = 'Johnson' LIMIT 1),
 null, false),

-- Robert Williams accounts (2 accounts: 1 in household, 1 individual)
('1PB10013', 'Williams Family Trust', 'trust', 
 (SELECT id FROM clients WHERE first_name = 'Robert' AND last_name = 'Williams' LIMIT 1),
 (SELECT id FROM households WHERE name = 'Williams Family Trust' LIMIT 1), 
 true),

('1PB10014', 'Robert Williams Investment', 'individual', 
 (SELECT id FROM clients WHERE first_name = 'Robert' AND last_name = 'Williams' LIMIT 1),
 null, false),

-- Emily Davis accounts (3 accounts: all individual)
('1PB10015', 'Emily Davis Retirement', 'ira', 
 (SELECT id FROM clients WHERE first_name = 'Emily' AND last_name = 'Davis' LIMIT 1),
 null, true),

('1PB10016', 'Emily Davis Trading', 'individual', 
 (SELECT id FROM clients WHERE first_name = 'Emily' AND last_name = 'Davis' LIMIT 1),
 null, false),

('1PB10017', 'Emily Davis Options', 'individual', 
 (SELECT id FROM clients WHERE first_name = 'Emily' AND last_name = 'Davis' LIMIT 1),
 null, false),

-- David Brown accounts (2 accounts: all individual)
('1PB10018', 'David Brown Investment', 'individual', 
 (SELECT id FROM clients WHERE first_name = 'David' AND last_name = 'Brown' LIMIT 1),
 null, true),

('1PB10019', 'David Brown Roth IRA', 'roth_ira', 
 (SELECT id FROM clients WHERE first_name = 'David' AND last_name = 'Brown' LIMIT 1),
 null, false),

-- Lisa Wilson accounts (4 accounts: all individual)
('1PB10020', 'Lisa Wilson Trust', 'trust', 
 (SELECT id FROM clients WHERE first_name = 'Lisa' AND last_name = 'Wilson' LIMIT 1),
 null, true),

('1PB10021', 'Lisa Wilson 403b', '403b', 
 (SELECT id FROM clients WHERE first_name = 'Lisa' AND last_name = 'Wilson' LIMIT 1),
 null, false),

('1PB10022', 'Lisa Wilson Trading', 'individual', 
 (SELECT id FROM clients WHERE first_name = 'Lisa' AND last_name = 'Wilson' LIMIT 1),
 null, false),

('1PB10023', 'Lisa Wilson Options', 'individual', 
 (SELECT id FROM clients WHERE first_name = 'Lisa' AND last_name = 'Wilson' LIMIT 1),
 null, false),

-- James Anderson accounts (3 accounts: 2 in household, 1 individual)
('1PB10024', 'Anderson Family Trust', 'trust', 
 (SELECT id FROM clients WHERE first_name = 'James' AND last_name = 'Anderson' LIMIT 1),
 (SELECT id FROM households WHERE name = 'Anderson Family Trust' LIMIT 1), 
 true),

('1PB10025', 'James Anderson 401k', '401k', 
 (SELECT id FROM clients WHERE first_name = 'James' AND last_name = 'Anderson' LIMIT 1),
 (SELECT id FROM households WHERE name = 'Anderson Family Trust' LIMIT 1), 
 false),

('1PB10026', 'James Anderson Personal', 'individual', 
 (SELECT id FROM clients WHERE first_name = 'James' AND last_name = 'Anderson' LIMIT 1),
 null, false),

-- Maria Anderson accounts (2 accounts: 1 in household, 1 individual)
('1PB10027', 'Maria Anderson SEP IRA', 'sep_ira', 
 (SELECT id FROM clients WHERE first_name = 'Maria' AND last_name = 'Anderson' LIMIT 1),
 (SELECT id FROM households WHERE name = 'Anderson Family Trust' LIMIT 1), 
 false),

('1PB10028', 'Maria Anderson Business', 'corporate', 
 (SELECT id FROM clients WHERE first_name = 'Maria' AND last_name = 'Anderson' LIMIT 1),
 null, true);

-- Insert account balances
INSERT INTO balances (account_id, total_value, buying_power, invested_value, cash, margin) VALUES
-- John Smith accounts
('1PB10001', 500000.00, 50000.00, 450000.00, 50000.00, 0.00),
('1PB10002', 250000.00, 15000.00, 235000.00, 15000.00, 0.00),
('1PB10003', 150000.00, 25000.00, 125000.00, 25000.00, 0.00),

-- Sarah Smith accounts
('1PB10004', 300000.00, 30000.00, 270000.00, 30000.00, 0.00),
('1PB10005', 180000.00, 10000.00, 170000.00, 10000.00, 0.00),

-- Michael Johnson accounts
('1PB10006', 750000.00, 75000.00, 675000.00, 75000.00, 0.00),
('1PB10007', 400000.00, 20000.00, 380000.00, 20000.00, 0.00),
('1PB10008', 200000.00, 50000.00, 150000.00, 50000.00, 0.00),
('1PB10009', 100000.00, 30000.00, 70000.00, 30000.00, 0.00),

-- Jennifer Johnson accounts
('1PB10010', 350000.00, 25000.00, 325000.00, 25000.00, 0.00),
('1PB10011', 1200000.00, 100000.00, 1100000.00, 100000.00, 0.00),
('1PB10012', 600000.00, 40000.00, 560000.00, 40000.00, 0.00),

-- Robert Williams accounts
('1PB10013', 800000.00, 80000.00, 720000.00, 80000.00, 0.00),
('1PB10014', 300000.00, 40000.00, 260000.00, 40000.00, 0.00),

-- Emily Davis accounts
('1PB10015', 220000.00, 15000.00, 205000.00, 15000.00, 0.00),
('1PB10016', 150000.00, 30000.00, 120000.00, 30000.00, 0.00),
('1PB10017', 80000.00, 20000.00, 60000.00, 20000.00, 0.00),

-- David Brown accounts
('1PB10018', 180000.00, 25000.00, 155000.00, 25000.00, 0.00),
('1PB10019', 120000.00, 10000.00, 110000.00, 10000.00, 0.00),

-- Lisa Wilson accounts
('1PB10020', 450000.00, 35000.00, 415000.00, 35000.00, 0.00),
('1PB10021', 280000.00, 15000.00, 265000.00, 15000.00, 0.00),
('1PB10022', 200000.00, 40000.00, 160000.00, 40000.00, 0.00),
('1PB10023', 90000.00, 25000.00, 65000.00, 25000.00, 0.00),

-- James Anderson accounts
('1PB10024', 650000.00, 60000.00, 590000.00, 60000.00, 0.00),
('1PB10025', 320000.00, 20000.00, 300000.00, 20000.00, 0.00),
('1PB10026', 180000.00, 30000.00, 150000.00, 30000.00, 0.00),

-- Maria Anderson accounts
('1PB10027', 240000.00, 20000.00, 220000.00, 20000.00, 0.00),
('1PB10028', 950000.00, 80000.00, 870000.00, 80000.00, 0.00);

-- Summary of what was created:
-- 10 clients (3 married couples + 4 single clients)
-- 4 households (3 for married couples + 1 for single client)
-- 28 accounts total (2-5 accounts per client)
-- Account types: trust, ira, individual, joint, roth_ira, 401k, 403b, sep_ira, corporate
-- Mix of household and individual accounts
-- Realistic account balances ranging from $80k to $1.2M