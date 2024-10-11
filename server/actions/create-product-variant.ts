'use server';

import { productVariantSchema } from "@/types/product-variant-schema";
import { actionClient } from "@/types/safe-action";
import { db } from "..";
import { productVariant, variantImages, variantTags } from "../schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const createVariantAction = actionClient
    .schema(productVariantSchema)
    .action(async ({ parsedInput: { id, editMode, color, productId, productType, tags, variantImages: newImages } }) => {
        try {
            //verificar si el producto existe 
            const product = await db.query.products.findFirst({
                where: (products, { eq }) => eq(products.id, productId),
            });
            console.log(product);
            if (!product) return { ok: false, msg: `Product with id:${productId} not found` };
            if (editMode && id) {
                // const productUpdate = Object.assign(product, )
                const editVariant = await db
                    .update(productVariant)
                    .set({ color, productType, updated: new Date() })
                    .where(eq(productVariant.id, id))
                    .returning();
                console.log(editVariant);
                await db.delete(variantTags).where(eq(variantTags.id, editVariant[0].id));
                await db.insert(variantTags).values(
                    tags.map((tag) => ({
                        tag,
                        variantId: editVariant[0].id,
                    }))
                );
                await db.delete(variantImages).where(eq(variantImages.variantId, editVariant[0].id));
                db.insert(variantImages).values(
                    newImages.map((image, i) => ({
                        name: image.name,
                        size: image.size,
                        url: image.url,
                        variantId: editVariant[0].id,
                        order: i,
                    }))
                );

                revalidatePath('/dashboard/products');
                return { ok: true, msg: 'Product was updated' };
            }

            if (!editMode) {
                const newVariant = await db.insert(productVariant).values({
                    color,
                    productId,
                    productType,
                }).returning();
                await db.insert(variantTags).values(
                    tags.map((tag) => ({
                        tag,
                        variantId: newVariant[0].id,
                    }))
                );
                await db.insert(variantImages).values(
                    newImages.map((image, i) => ({
                        name: image.name,
                        size: image.size,
                        url: image.url,
                        variantId: newVariant[0].id,
                        order: i,
                    }))
                );

                revalidatePath('/dashboard/products');
                return { ok: true, msg: 'Product was created' };
            }
        } catch (error) {
            return {
                ok: false,
                msg: "Error on servidor",
            }
        }
    }) 