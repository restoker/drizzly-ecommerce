"use server";

import { db } from "..";

export const getProductAction = async (id: string) => {
    try {
        const producto = await db.query.products.findFirst({
            where: (products, { eq }) => eq(products.id, id),
        });
        if (!producto) return { ok: false, msg: 'Product Dont Exist' };
        // console.log(producto);
        return { ok: true, msg: 'Product found', data: producto };
    } catch (e) {
        return {
            ok: false,
            msg: 'Error on server',
        }
    }
} 