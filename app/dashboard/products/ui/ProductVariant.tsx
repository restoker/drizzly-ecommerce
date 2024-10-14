'use client';

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { VariantsWithImagesTags } from "@/lib/infer-type";
import { productVariantSchema } from "@/types/product-variant-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { InputTags } from "./InputTags";
import VariantImages from "./variant-images";
import { useAction } from "next-safe-action/hooks";
import { createVariantAction } from "@/server/actions/create-product-variant";
import { toast } from "sonner";

interface FormProps {
    editMode: boolean,
    productId?: string,
    variant?: VariantsWithImagesTags,
    children: React.ReactNode,
}

const ProductVariant = ({ editMode, productId, variant, children }: FormProps) => {
    const [open, setOpen] = useState(false);
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

    const setEdit = () => {
        if (!editMode) {
            form.reset();
            return;
        }
        if (editMode && variant) {
            form.setValue('editMode', true);
            form.setValue('id', variant.id);
            form.setValue('productId', variant.productId);
            form.setValue('color', variant.color);
            form.setValue('productType', variant.productType);
            form.setValue('tags', variant.variantTags.map((tag) => {
                return tag.tag;
            }));
            form.setValue('variantImages', variant.variantImages.map((image) => ({
                name: image.name,
                size: image.size,
                url: image.url,
                // key: image.key,
            }))
            );
        }
    }

    useEffect(() => {
        // if (!editMode) return;
        setEdit();
    }, [])


    const { execute, status } = useAction(createVariantAction, {
        onExecute: () => {
            toast.loading('Creating Product');
        },
        onSuccess: ({ data }) => {
            if (data) {
                if (data.ok) {
                    if (!editMode) setOpen(false);
                    toast.success(data.msg, { dismissible: true });
                } else {
                    toast.error(data.msg, { dismissible: true });
                }
            }
        },
        onError: () => {
            toast.error('Error on Server', { dismissible: true });
        }
    });

    function onSubmit(values: z.infer<typeof productVariantSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        // console.log(values);
        execute(values);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                {children}
            </DialogTrigger>
            <DialogContent className="lg:max-w-screen-md overflow-y-scroll max-h-screen">
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
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <VariantImages />
                        <div className="flex gap-4 items-center justify-center">
                            {editMode && variant && (
                                <Button
                                    variant={'destructive'}
                                    disabled={
                                        status === "executing" ||
                                        !form.formState.isValid ||
                                        !form.formState.isDirty
                                    }
                                    type="button"
                                    onClick={e => {
                                        e.preventDefault();
                                    }}
                                >
                                    Delete Variant
                                </Button>
                            )}
                            <Button type="submit">{editMode ? 'Edit variant' : 'Create variant'}</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default ProductVariant;

