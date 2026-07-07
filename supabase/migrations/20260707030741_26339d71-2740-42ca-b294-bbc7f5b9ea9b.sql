ALTER TYPE order_fulfillment ADD VALUE IF NOT EXISTS 'pending' BEFORE 'processing';
ALTER TYPE order_fulfillment ADD VALUE IF NOT EXISTS 'confirmed' AFTER 'processing';