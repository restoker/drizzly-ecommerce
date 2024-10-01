'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { VariantsWithImagesTags } from "@/lib/infer-type";
import React from "react";

const ProductVariant = (
    {
        editMode,
        productId,
        variant,
        children
    }: {
        editMode: boolean,
        productId?: string,
        variant?: VariantsWithImagesTags,
        children: React.ReactNode,
    }
) => {
    return (
        <Dialog>
            <DialogTrigger>
                {children}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default ProductVariant;

