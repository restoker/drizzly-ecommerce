"use server";

import { productSchema } from "@/types/product-schema";
import { actionClient } from "@/types/safe-action";
import { db } from "..";
import { products } from '../schema';
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const createProductAction = actionClient
    .schema(productSchema)
    .action(async ({ parsedInput: { title, price, description, id }, ctx: { } }) => {
        try {
            if (id) {
                const product = await db.query.products.findFirst({
                    where: (products, { eq }) => eq(products.id, id),
                })
                if (!product) return { ok: false, msg: 'Product Not found' };
                const productUpdated = await db.update(products).set({
                    ...(title && { title }),
                    ...(price && { price }),
                    ...(description && { description }),
                }).where(eq(products.id, id)).returning();
                revalidatePath('/dashboard/products')
                return { ok: true, msg: `${productUpdated[0].title} was updated` }
            }
            if (!id) {
                const productAdded = await db.insert(products).values({
                    title,
                    description,
                    price
                }).returning();
                revalidatePath('/dashboard/products')
                return { ok: true, msg: `${productAdded[0].title} se creo correctamente` };
            }

        } catch (e) {
            console.log(e);
            return { ok: false, msg: 'Error on server' };
        }
    })