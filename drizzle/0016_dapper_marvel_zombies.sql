ALTER TABLE "productVariant" DROP CONSTRAINT "productVariant_id_products_id_fk";
--> statement-breakpoint
ALTER TABLE "variantImages" DROP CONSTRAINT "variantImages_id_productVariant_id_fk";
--> statement-breakpoint
ALTER TABLE "variantTags" DROP CONSTRAINT "variantTags_id_productVariant_id_fk";
--> statement-breakpoint
ALTER TABLE "productVariant" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "variantImages" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "variantTags" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "productVariant" ADD COLUMN "productId" text NOT NULL;--> statement-breakpoint
ALTER TABLE "variantImages" ADD COLUMN "variantId" text NOT NULL;--> statement-breakpoint
ALTER TABLE "variantTags" ADD COLUMN "variantId" text NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "productVariant" ADD CONSTRAINT "productVariant_productId_products_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "variantImages" ADD CONSTRAINT "variantImages_variantId_productVariant_id_fk" FOREIGN KEY ("variantId") REFERENCES "public"."productVariant"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "variantTags" ADD CONSTRAINT "variantTags_variantId_productVariant_id_fk" FOREIGN KEY ("variantId") REFERENCES "public"."productVariant"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
