'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { VariantsWithImagesTags } from "@/lib/infer-type";
import { productVariantSchema } from "@/types/product-variant-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface FormProps {
    editMode: boolean,
    productId?: string,
    variant?: VariantsWithImagesTags,
    children: React.ReactNode,
}

const ProductVariant = ({ editMode, productId, variant, children }: FormProps) => {

    const form = useForm<z.infer<typeof productVariantSchema>>({
        resolver: zodResolver(productVariantSchema),
        defaultValues: {
            tags: [],
            variantImages: [],
            color: "#000000",
            editMode,
            id: undefined,
            productId,
            productType: "Black Notebook",
        },
        mode: "all",
    })

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

