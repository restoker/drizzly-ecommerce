ALTER TABLE "productVariant" DROP CONSTRAINT "productVariant_productId_products_id_fk";
--> statement-breakpoint
ALTER TABLE "variantImages" DROP CONSTRAINT "variantImages_variantId_productVariant_id_fk";
--> statement-breakpoint
ALTER TABLE "variantTags" DROP CONSTRAINT "variantTags_variantId_productVariant_id_fk";
--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'productVariant'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "productVariant" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'variantImages'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "variantImages" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'variantTags'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "variantTags" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "productVariant" ADD CONSTRAINT "productVariant_id_products_id_fk" FOREIGN KEY ("id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "variantImages" ADD CONSTRAINT "variantImages_id_productVariant_id_fk" FOREIGN KEY ("id") REFERENCES "public"."productVariant"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "variantTags" ADD CONSTRAINT "variantTags_id_productVariant_id_fk" FOREIGN KEY ("id") REFERENCES "public"."productVariant"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "productVariant" DROP COLUMN IF EXISTS "productId";--> statement-breakpoint
ALTER TABLE "variantImages" DROP COLUMN IF EXISTS "variantId";--> statement-breakpoint
ALTER TABLE "variantTags" DROP COLUMN IF EXISTS "variantId";