import { z } from "zod";

export const registerSchema = z.object({
    email: z.string().email({ message: 'Enter a valid email' }),
    password: z.string()
        .min(5, { message: "Password is too short" })
        .max(50, { message: "Password is too long" }),
    name: z.string().min(3),
});