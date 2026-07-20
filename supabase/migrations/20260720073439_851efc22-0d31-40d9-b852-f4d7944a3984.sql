-- Clear all gallery items for fresh admin uploads
DELETE FROM public.gallery_items;

-- Remove price/mrp seed data so no prices show anywhere (products now show as categories)
UPDATE public.products SET price = NULL, mrp = NULL;