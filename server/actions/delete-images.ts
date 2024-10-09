"use server";

import { UTApi } from "uploadthing/server";

const utapi = new UTApi();
//para elminar solo es necesario enviar el key de la imagen de uploadthing
export const deleteUTFiles = async (files: string[]) => {
    // files es un array de keys [e1d8eda2-6661-4537-9fe4-10c6bf31e511-3295uo.png, ...]
    try {
        await utapi.deleteFiles(files);
    } catch (e) {
        return { ok: false, msg: 'Error on server' }
    }
}

// await deleteUTFiles([file.key]);