import { z } from "zod";

export const settingsSchema = z.object({
    name: z.optional(z.string()),
    image: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(5)),
    newPassword: z.optional(z.string().min(5))
})
    .refine((data) => {
        if (data.password && !data.newPassword) {
            return false;
        }
        return true;
    }, { message: 'New Password is required', path: ['newPassword'] }
    );