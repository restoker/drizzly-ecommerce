'use server';

import { eq } from "drizzle-orm";
import { db } from "..";
import { emailTokens, users, passwordResetTokens, twoFactorTokens } from '../schema';
import crypto from 'crypto'

const getVerificationTokenByEmail = async (email: string) => {
    try {
        const verificationToken = await db.query.emailTokens.findFirst({
            where: (emailTokens, { eq }) => eq(emailTokens.email, email),
        });
        // console.log(verificationToken);
        return verificationToken;
    } catch (e) {
        return null;
    }
}

export const generateEmailVerificationToken = async (email: string) => {
    const token = crypto.randomUUID();
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await getVerificationTokenByEmail(email);
    if (existingToken) {
        const emailTokenDeleted = await db.delete(emailTokens).where(eq(emailTokens.id, existingToken.id)).returning();
    }
    const verificationToken = await db.insert(emailTokens).values({
        email,
        token,
        expires,
    }).returning();

    return verificationToken;
}


export const confirmToken = async (token: string) => {
    try {
        // verificar que el token de registro existe
        const existingToken = await db.query.emailTokens.findFirst({
            where: (emailTokens, { eq }) => eq(emailTokens.token, token),
        });

        if (!existingToken) return { ok: false, msg: 'El token no existe' };

        // verificar si el token expiro
        const hasExpired = new Date(existingToken.expires) < new Date();

        if (hasExpired) return { ok: false, msg: 'The token haa expired' };
        // verificar si el email del usuario existe
        const existe = await db.query.users.findFirst({
            where: (users, { eq }) => eq(users.email, existingToken.email),
        });

        if (!existe) return { ok: false, msg: 'Email does not exist' };

        const usuarioUpdated = await db.update(users).set({
            emailVerified: new Date(),
            email: existingToken.email,
        }).where(eq(users.id, existe.id)).returning();

        await db.delete(emailTokens).where(eq(emailTokens.id, existingToken.id));

        return { ok: true, msg: 'Su cuenta fue confirmada' };

    } catch (e) {
        return {
            ok: false,
            msg: 'Error validating token'
        }
    }
}


export const getPasswordResetTokenByToken = async (token: string) => {
    try {
        const existToken = await db.query.passwordResetTokens.findFirst({
            where: (passwordResetTokens, { eq }) => eq(passwordResetTokens.token, token)
        });
        return existToken;
    } catch (e) {
        return null;
    }
}

export const forgotPasswordResetToken = async (email: string) => {
    try {
        const token = crypto.randomUUID();

        const expires = new Date(new Date().getTime() + 3600 * 1000);

        const existingToken = await getPasswordResetTokenByEmail(email);
        if (existingToken) {
            await db.delete(passwordResetTokens)
                .where(eq(passwordResetTokens.id, existingToken.id));
        }
        const passwordResetToken = await db.insert(passwordResetTokens).values({
            email,
            token,
            expires,
        }).returning();
        return passwordResetToken
    } catch (e) {
        return null
    }
}

export const getPasswordResetTokenByEmail = async (email: string) => {
    try {
        const passwordResetToken = await db.query.passwordResetTokens.findFirst({
            where: (passwordResetTokens, { eq }) => eq(passwordResetTokens.email, email),
        })
        return passwordResetToken;
    } catch (e) {
        return null;
    }
}

export const getTwoFactorTokenByEmail = async (email: string) => {
    try {
        const twoFactorToken = await db.query.twoFactorTokens.findFirst({
            where: (twoFactorTokens, { eq }) => eq(twoFactorTokens.email, email),
        });

        return twoFactorToken;
    } catch (e) {
        return null;
    }
}

export const getTwoFactorTokenByToken = async (token: string) => {
    try {
        const twoFactorToken = await db.query.twoFactorTokens.findFirst({
            where: (twoFactorTokens, { eq }) => eq(twoFactorTokens.token, token)
        });
        return twoFactorToken;
    } catch (e) {
        return null;
    }
}


export const generateTwoFactorToken = async (email: string, userId: string) => {
    try {
        const token = crypto.randomInt(100_000, 1_000_000).toString();
        //Hour Expiry
        const expires = new Date(new Date().getTime() + 3600 * 1000);

        const existingToken = await getTwoFactorTokenByEmail(email);

        if (existingToken) {
            await db
                .delete(twoFactorTokens)
                .where(eq(twoFactorTokens.id, existingToken.id))
        }
        const twoFactorToken = await db
            .insert(twoFactorTokens)
            .values({
                email,
                token,
                expires,
                userID: userId,
            })
            .returning();
        return twoFactorToken
    } catch (e) {
        return null
    }
}