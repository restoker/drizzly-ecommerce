import { productVariantSchema } from "@/types/product-variant-schema";
import { actionClient } from "@/types/safe-action";
import { db } from "..";
import { productVariant, variantTags } from "../schema";
import { eq } from "drizzle-orm";


export const createProductVariant = actionClient
    .schema(productVariantSchema)
    .action(async ({ parsedInput: { id, editMode, color, productId, productType, tags, variantImages } }) => {
        try {
            //verificar si el producto existe 
            const product = await db.query.products.findFirst({
                where: (products, { eq }) => eq(products.id, productId),
            })
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
                )
            }
        } catch (error) {

        }
    }) 