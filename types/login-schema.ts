import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email({ message: 'Enter a valid email' }),
    password: z.string().min(4).max(50),
    code: z.optional(z.string()),
});