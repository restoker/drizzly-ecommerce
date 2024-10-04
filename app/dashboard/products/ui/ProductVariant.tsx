'use client';

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { VariantsWithImagesTags } from "@/lib/infer-type";
import { productVariantSchema } from "@/types/product-variant-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { InputTags } from "./InputTags";

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
    });

    function onSubmit(values: z.infer<typeof productVariantSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
    }

    return (
        <Dialog>
            <DialogTrigger>
                {children}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{editMode ? 'Edit' : 'Create'} variant</DialogTitle>
                    <DialogDescription>
                        Manager your product variant here. You can add tags, images, and more.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="productType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Variant Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Pick a title for your product"
                                            {...field}
                                        />
                                    </FormControl>
                                    {/* <FormDescription>
                                        This is your public display name.
                                    </FormDescription> */}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="color"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Variant Color</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="color"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="tags"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tags</FormLabel>
                                    <FormControl>
                                        <InputTags
                                            {...field}
                                            onChange={(e) => field.onChange(e)}
                                        />
                                    </FormControl>
                                    {/* <FormDescription>
                                        This is your public display name.
                                    </FormDescription> */}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* <VariantImages /> */}
                        {editMode && variant && (
                            <Button
                                type="button"
                                onClick={e => {
                                    e.preventDefault();
                                }}
                            >
                                Delete Variant
                            </Button>
                        )}
                        <Button type="submit">{editMode ? 'Create variant' : 'Edit variant'}</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default ProductVariant;

