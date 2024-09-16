import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/server";
import Credentials from "next-auth/providers/credentials"
import { loginSchema } from "@/types/login-schema";
import bcrypt from 'bcryptjs';
import { eq } from "drizzle-orm";
import { accounts, users } from "./schema";
import google from "next-auth/providers/google";
import github from "next-auth/providers/github";

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: DrizzleAdapter(db),
    secret: process.env.AUTH_SECRET,
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async session({ session, user, token }) {
            if (session && token.sub) {
                session.user.id = token.sub;
            }
            if (session.user && token.role) {
                session.user.role = token.role as string;
            }
            if (session.user) {
                session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
                session.user.name = token.name;
                session.user.email = token.email as string;
                session.user.isOauth = token.isOauth as boolean;
                session.user.image = token.image as string;
            }
            return session
        },
        async jwt({ token }) {
            // console.log(token);
            if (!token.sub) return token;
            const existUser = await db.query.users.findFirst({
                where: eq(users.id, token.sub)
            })
            if (!existUser) return token;
            const existsAccount = await db.query.accounts.findFirst({
                where: eq(accounts.userId, existUser.id),
            });

            // console.log(existsAccount);
            token.isOauth = !!existsAccount;
            token.name = existUser.name;
            token.email = existUser.email;
            token.role = existUser.role;
            token.isTwoFactorEnabled = existUser.twoFactorEnabled;
            token.image = existUser.image;
            return token;
        }
    },
    providers: [
        Credentials({
            authorize: async (credentials) => {
                const validatedFields = loginSchema.safeParse(credentials);

                if (validatedFields.success) {
                    const { email, password, } = validatedFields.data;

                    const user = await db.query.users.findFirst({
                        where: eq(users.email, email),
                    });

                    if (!user || !user.password) return null;

                    // verificar el password
                    const passCorrect = await bcrypt.compare(password, user.password);

                    if (!passCorrect) return null;
                    const { password: otro, ...rest } = user;
                    return rest;
                }
                return null;
                // logic to salt and hash password
                // const pwHash = saltAndHashPassword(credentials.password)
                // logic to verify if user exists
                // user = await getUserFromDb(credentials.email, pwHash)
                // if (!user) {
                //     // No user found, so this is their first attempt to login
                //     // meaning this is also the place you could do registration
                //     throw new Error("User not found.")
                // }
                // // return user object with the their profile data
                // return user;
            },

        }),
        google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        github({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
        }),
    ],
})