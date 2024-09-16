'use server';

import { Session } from "next-auth";
import { auth } from "../auth";

interface SessionAuth {
    ok: boolean;
    session?: Session;
    msg?: string;
}

export const getSessionUser = async (): Promise<SessionAuth> => {
    try {
        const session = await auth();
        if (!session) return { ok: false, msg: 'no hay session activa' }
        return {
            ok: true,
            session: session,
        }
    } catch (e) {
        return {
            ok: false,
            msg: 'Error al obtener la session, verifica su base de datos',
            session: undefined,
        }
    }
}