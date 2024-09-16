"use server";

import { forgotPasswordSchema } from "@/types/forgot-password-schema";
import { actionClient } from "@/types/safe-action";
import { db } from "..";
import { forgotPasswordResetToken } from "./tokens";
import { sendEmailResetPassword } from "./email";

export const forgotPasswordAction = actionClient
    .schema(forgotPasswordSchema)
    .action(async ({ parsedInput: { email }, ctx: { } }) => {
        try {
            const user = await db.query.users.findFirst({
                where: (users, { eq }) => eq(users.email, email),
            });
            if (!user) return { ok: false, msg: 'User not found' };

            const passwordResetToken = await forgotPasswordResetToken(email);
            if (!passwordResetToken) return { ok: false, msg: 'No ser pudo generar el token' };
            await sendEmailResetPassword(passwordResetToken[0].email, passwordResetToken[0].token);

            return { ok: true, mag: 'Se envió un correo a su cuenta de email' }
        } catch (e) {

        }
    });