"use server";

import { actionClient } from "@/types/safe-action";
import { z } from "zod";
import { db } from "..";
import { products } from "../schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const deleteProductAction = actionClient
    .schema(z.object({ id: z.string().trim().uuid() }))
    .action(async ({ parsedInput: { id }, ctx: { } }) => {
        if (!id) return { ok: false, msg: 'Need id for this action' };
        try {
            // find the id
            const product = await db.query.products.findFirst({
                where: (products, { eq }) => eq(products.id, id),
            })
            if (!product) return { ok: false, msg: 'Product not found' };
            const data = await db.delete(products)
                .where(eq(products.id, id))
                .returning();
            revalidatePath('/dashboard/products');
            return { ok: true, msg: `Product ${data[0].title} has been delete` };
        } catch (e) {
            console.log(e);
            return {
                ok: false,
                msg: 'Error on server',
            }
        }
    })
