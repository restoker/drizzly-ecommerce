"use server";

import { actionClient } from "@/types/safe-action";
import { settingsSchema } from "@/types/settings-schema";
import { auth } from "../auth";
import { db } from "..";
import bcrypt from 'bcryptjs';
import { users } from "../schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const settingsActions = actionClient
    .schema(settingsSchema)
    .action(async ({ parsedInput: { email, image, name, password, newPassword, isTwoFactorEnabled }, ctx: { } }) => {
        // console.log({ email });
        // console.log({ image });
        // console.log({ name });
        // console.log({ password });
        const session = await auth();
        if (!session?.user) return { ok: false, msg: 'No have permissions' };

        const user = await db.query.users.findFirst({
            where: (users, { eq }) => eq(users.id, session.user.id),
        });
        if (!user) return { ok: false, msg: 'User not Authorized' };
        if (session.user.isOauth) {
            email = undefined;
            password = undefined;
            newPassword = undefined;
            isTwoFactorEnabled = undefined;
        }

        if (password && newPassword && user.password) {
            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) return { ok: false, msg: 'Credentials no valids' };
            // if(password === newPassword) return{ok:false, msg: 'The new password is the same as the old password'}
            const isSame = await bcrypt.compare(newPassword, user.password);
            // console.log(isSame);
            if (isSame) return { ok: false, msg: 'New Password is the same as the old passsword' };
            const hashedPassword = await bcrypt.hash(newPassword!, 10);

            const updatedUser = await db
                .update(users)
                .set({
                    ...(isTwoFactorEnabled && { twoFactorEnabled: isTwoFactorEnabled }),
                    ...(name && { name: name }),
                    ...(email && { email: email }),
                    ...(newPassword && { password: hashedPassword }),
                    ...(image && { image: image }),
                })
                .where(eq(users.id, user.id))
                .returning();
            revalidatePath('/dashboard/settings');
            return { ok: true, msg: 'Setting updated' }
        }
        await db
            .update(users)
            .set({
                ...(isTwoFactorEnabled && { twoFactorEnabled: isTwoFactorEnabled }),
                ...(name && { name: name }),
                ...(email && { email: email }),
                // ...(newPassword && { password: hashedPassword }),
                ...(image && { image: image }),
            })
            .where(eq(users.id, user.id))
            .returning();
        revalidatePath('/dashboard/settings');
        return { ok: true, msg: 'Usuario actualizado' };

    });