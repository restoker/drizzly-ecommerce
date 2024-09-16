import { auth } from "@/server/auth";
// import { getSession } from "next-auth/react";
import { createSafeActionClient } from "next-safe-action";
// import { cookies } from "next/headers";

export const actionClient = createSafeActionClient().use(async ({ next, ctx }) => {
    // const session = cookies().get("session")?.value;
    const session = auth();
    // console.log(session);

    if (!session) {
        throw new Error("Session not found!");
    }

    // const userId = await getUserIdFromSessionId(session);

    // if (!userId) {
    //     throw new Error("Session is not valid!");
    // }

    // return next({ ctx: { userId } });
    return next({ ctx: { session: 'hola :D' } });
});;