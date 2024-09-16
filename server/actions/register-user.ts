'use server';
import { registerSchema } from "@/types/register-schema";
import { actionClient } from "@/types/safe-action";
import bcrypt from 'bcryptjs';
import { db } from "..";
import { generateEmailVerificationToken } from "./tokens";
import { users } from "../schema";
import { sendVerificationEmail } from "./email";
// import { eq } from "drizzle-orm";
// import { accounts } from "../schema";

export const registerUserWithEmail = actionClient
    .schema(registerSchema)
    .action(async ({ parsedInput: { email, password, name }, ctx: { } }) => {
        try {
            // verificar si el usuario ya a existe
            const existe = await db.query.users.findFirst({
                where: (users, { eq }) => eq(users.email, email),
            });

            if (existe) {
                if (!existe.emailVerified) {
                    const verificationToken = await generateEmailVerificationToken(email);
                    await sendVerificationEmail(email, verificationToken[0].token, existe.name!);
                    return { ok: false, msg: 'Se volvio a enviar un email a su bande de entrada' };
                }
                return { ok: false, msg: 'Email is already in use' };
            }

            // hash password
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);

            // crear usuario
            await db.insert(users).values({
                email,
                name,
                password: hash,
            }).returning();

            const verificationToken = await generateEmailVerificationToken(email);
            // console.log(verificationToken);
            const respuesta = await sendVerificationEmail(email, verificationToken[0].token, name);
            // console.log(respuesta);s
            if (respuesta?.ok) {
                return {
                    ok: true,
                    msg: 'Se envio un email a su correo'
                }
            } else {
                return {
                    ok: false,
                    msg: respuesta?.msg
                }
            }

            // return {
            //     ok: true,
            //     msg: 'Se envio un email a su correo'
            // }

        } catch (e) {
            return {
                ok: false,
                msg: 'Error en el servidor'
            }
        }
        // const nuevoUsuario = await db.insert(accounts).values({

        // })
    })