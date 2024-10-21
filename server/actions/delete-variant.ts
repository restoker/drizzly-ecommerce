'use server';

import { actionClient } from "@/types/safe-action";
import { z } from "zod";
import { db } from "..";
import { productVariant } from "../schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { deleteUTFiles } from "./delete-images";

export const deleteVariantAction = actionClient
    .schema(z.object({ id: z.string().trim().uuid() }))
    .action(async ({ parsedInput: { id } }) => {
        try {
            // verificar si la vairiante existe
            const variant = await db.query.productVariant.findFirst({
                where: (productVariant, { eq }) => eq(productVariant.id, id)
            });
            if (!variant) return { ok: false, msg: `Product with ${id} not found` };
            // search images from omage variant
            const images = await db.query.variantImages.findMany({
                where: (variantImages, { eq }) => eq(variantImages.variantId, variant?.id),
            })
            // delete images from uploadthings
            let deleteKeys: string[] = [];
            for (const image of images) {
                deleteKeys = [...deleteKeys, image.key];
            }

            await deleteUTFiles(deleteKeys);

            await db.delete(productVariant).where(eq(productVariant.id, id));
            revalidatePath('dashboard/products')
            return { ok: false, msg: `${variant.id} was eliminated` };
        } catch (e) {
            return { ok: false, msg: 'Error on server' };
        }
    });