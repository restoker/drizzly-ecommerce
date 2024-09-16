import { z } from "zod";

export const newPasswordSchema = z.object({
    password: z.string().min(4).max(50),
    token: z.string().nullable().optional(),
});