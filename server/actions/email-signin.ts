'use server';

import { loginSchema } from "@/types/login-schema";
import { actionClient } from "@/types/safe-action";
import { db } from "..";
import { eq } from "drizzle-orm";
import { users, accounts, twoFactorTokens } from '../schema';
import { generateEmailVerificationToken, generateTwoFactorToken, getTwoFactorTokenByEmail } from './tokens';
import { sendTwoFactorTokenByEmail, sendVerificationEmail } from "./email";
import { signIn } from "../auth";
import { AuthError } from "next-auth";

export const loginWithEmailAndPassword = actionClient
    .schema(loginSchema)
    .action(async ({ parsedInput: { email, password, code }, ctx: { } }) => {
        // console.log(email);
        // console.log(password);
        // console.log(code);
        try {
            const userExist = await db.query.users.findFirst({
                where: eq(users.email, email),
            });
            if (!userExist) return { ok: false, msg: 'User or password incorrect' };
            if (userExist.email !== email) {
                return { ok: false, error: "user or password not found" }
            };
            // verificar el tipo de account
            const haveAccount = await db.query.accounts.findFirst({
                where: (accounts, { eq }) => eq(accounts.userId, userExist.id),
            })

            if (haveAccount) return { ok: false, msg: 'User or password incorrect' }


            // si el email no a sido verificado
            if (!userExist.emailVerified) {
                const verificationToken = await generateEmailVerificationToken(userExist.email);
                await sendVerificationEmail(userExist.email, verificationToken[0].token, userExist.name!);
                return { ok: false, msg: 'Se volvio a enviar un mensaje de confirmacion' }
            };

            if (userExist.twoFactorEnabled && userExist.email) {
                if (code) {
                    const twoFactorToken = await getTwoFactorTokenByEmail(userExist.email);
                    if (!twoFactorToken) return { ok: false, msg: 'Token no valido' };
                    if (twoFactorToken.token !== code) return { ok: false, msg: 'Invalid token' };
                    const hasExpired = new Date(twoFactorToken.expires) < new Date();
                    if (hasExpired) return { ok: false, msg: 'Token has expired' };
                    await db.delete(twoFactorTokens).where(eq(twoFactorTokens.id, twoFactorToken.id));
                } else {
                    const token = await generateTwoFactorToken(userExist.email, userExist.id);
                    if (!token) return { ok: false, msg: 'Token not generated' };

                    await sendTwoFactorTokenByEmail(token[0].email, token[0].token);
                    return { ok: true, msg: 'Se envio un token  de autenticación a su correo', twoFactor: true };
                }
            }

            const user = await signIn('credentials', {
                ...{ email, password },
                redirect: false,
            })

            return { ok: true, msg: 'Wellcome back', data: userExist.email };
        } catch (e) {
            console.log(e);
            if (e instanceof AuthError) {
                switch (e.type) {
                    case 'CredentialsSignin':
                        return { ok: false, msg: 'Invalid credentials.' };
                    case 'AccessDenied':
                        return { ok: false, msg: e.message };
                    case 'OAuthSignInError':
                        return { ok: false, msg: e.message };

                    default:
                        return { ok: false, msg: 'Something went wrong' };
                }
            }
            return { ok: false, msg: 'error on server' };
        }
    });