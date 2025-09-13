-- Add missing foreign key constraints
-- This migration adds the missing foreign key relationship between accounts.client_id and clients.id

-- Add foreign key constraint between accounts.client_id and clients.id (if not already exists)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'accounts_client_id_fkey' 
        AND table_name = 'accounts'
    ) THEN
        ALTER TABLE "public"."accounts" 
        ADD CONSTRAINT "accounts_client_id_fkey" 
        FOREIGN KEY ("client_id") 
        REFERENCES "public"."clients"("id") 
        ON DELETE CASCADE 
        ON UPDATE CASCADE;
    END IF;
END $$;
