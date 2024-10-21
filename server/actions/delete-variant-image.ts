'use server';

import { actionClient } from "@/types/safe-action";
import { z } from "zod";

export const deleteVariantImageAction = actionClient
    .schema(z.object({ id: z.string().trim().uuid() }))
    .action(async ({ parsedInput: { id } }) => {

    });