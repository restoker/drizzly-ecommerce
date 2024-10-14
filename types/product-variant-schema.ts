import { z } from "zod";

export const productVariantSchema = z.object({
    id: z.string().uuid().optional(),
    productId: z.string().uuid(),
    editMode: z.boolean(),
    productType: z.string().min(3, { message: "Product type must be at least 3 characters long" }),
    color: z.string().min(3, { message: "Color must be at least 3 characters long" }),
    tags: z.array(z.string()).min(1, { message: "You must provide at least one tag" }),
    variantImages: z.array(z.object({
        url: z.string().refine((url) => url.search('blob:') !== 0, { message: 'Plese wait for the image to upload' }),
        size: z.number(),
        name: z.string(),
        key: z.string().optional(),
        id: z.number().optional(),
    }))
})