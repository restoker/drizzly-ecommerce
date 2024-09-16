'use server';

import { newPasswordSchema } from "@/types/new-password-schema";
import { actionClient } from "@/types/safe-action";
import { getPasswordResetTokenByToken } from "./tokens";
import { db } from '../index';
import bcrypt from 'bcryptjs'
import { passwordResetTokens, users } from "../schema";
import { eq } from "drizzle-orm";
import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";

export const newPasswordAction = actionClient
    .schema(newPasswordSchema)
    .action(async ({ parsedInput: { password, token = '' }, ctx: { } }) => {
        const pool = new Pool({ connectionString: process.env.DATABASE_URL });
        const dbPool = drizzle(pool)
        if (!token || token.length === 0) return { ok: false, msg: 'Token is required' }
        try {
            // verificar si el token de nuevo password es valido
            const existToken = await getPasswordResetTokenByToken(token);
            if (!existToken) return { ok: false, msg: 'Invalid Token' };
            const hasExpired = new Date(existToken.expires) < new Date();
            if (hasExpired) return { ok: false, msg: 'Token has expired' };
            const existinUser = await db.query.users.findFirst({
                where: (users, { eq }) => eq(users.email, existToken.email),
            });
            if (!existinUser) return { ok: false, msg: 'User not Found' };
            // encriptar la nueva contraseña
            const hashedPassword = await bcrypt.hash(password, 10);

            await dbPool.transaction(async (tx) => {
                await tx.update(users)
                    .set({ password: hashedPassword })
                    .where(eq(users.id, existinUser.id));
                await tx.delete(passwordResetTokens)
                    .where(eq(passwordResetTokens.id, existToken.id));
            });

            return { ok: true, success: 'Password Updated' };

        } catch (e) {
            return { ok: false, msg: 'Error on server' }
        }
    });
