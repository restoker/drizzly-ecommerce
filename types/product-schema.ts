import { z } from "zod";

export const productSchema = z.object({
    id: z.string().uuid().optional(),
    title: z.string().min(5, { message: 'Title must be at least 5 characters long' }),
    description: z.string().min(40, { message: 'Description must be at least 40 characters long' }),
    price: z.coerce.number({ invalid_type_error: 'Price must be a number' }).positive({ message: 'Price must be a positive number' }),
});

export type ProductSchemaType = z.infer<typeof productSchema>;