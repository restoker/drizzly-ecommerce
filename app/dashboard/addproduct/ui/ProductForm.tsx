'use client';
import { productSchema, ProductSchemaType } from "@/types/product-schema";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { DollarSign, UserCircleIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Tiptap from "./Tiptap";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { createProductAction } from "@/server/actions/create-product";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { getProductAction } from "@/server/actions/get-product";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ProductForm = () => {

    const [chargetProduct, setChargetProduct] = useState(false);

    // const { register, handleSubmit, formState: { errors, isValid, isDirty }, control, setValue, setError, getValues } = useForm<ProductSchemaType>({
    //     mode: 'onChange',
    //     resolver: zodResolver(productSchema),
    //     defaultValues: {
    //         title: '',
    //         description: '',
    //         price: 0,
    //     }
    // });

    const form = useForm<ProductSchemaType>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            title: "",
            description: "",
            price: 0,
        },
        mode: "onChange",
    })

    const router = useRouter();
    const params = useSearchParams();
    const editMode = params.get('id');

    const checkProduct = async () => {
        if (editMode) {
            setChargetProduct(true);
            const { ok, data: product, msg } = await getProductAction(editMode);
            setChargetProduct(false);
            if (!ok) {
                toast.error(`${msg}`);
                router.push('/dashboard/products');
                return;
            }
            if (product) {
                form.setValue('title', product.title);
                form.setValue('description', product.description);
                form.setValue('price', product.price);
                form.setValue('id', editMode);
            }
        }
    }

    useEffect(() => {
        if (!editMode) return;
        if (editMode) {
            checkProduct();
        }
    }, [editMode]);

    const { execute, status } = useAction(createProductAction, {
        onSuccess: ({ data }) => {
            if (data) {
                if (data.ok) {
                    // toast.success('Message of System', {
                    //     classNames: {
                    //         toast: 'bg-cyan-50',
                    //         title: 'text-cyan-500',
                    //         description: 'text-cyan-500',
                    //         actionButton: 'bg-zinc-400',
                    //         cancelButton: 'bg-gray-100',
                    //         closeButton: 'bg-white',
                    //         icon: 'text-black',
                    //     },
                    //     description: data.msg,
                    //     duration: 2000,
                    //     position: 'top-right',
                    //     dismissible: true,
                    //     closeButton: true,
                    //     // icon: <MyIcon />,
                    // });
                    toast.success(data.msg, { dismissible: true });
                    router.push('/dashboard/products');
                }

                if (!data.ok) {
                    toast.error('Error', {
                        classNames: {
                            toast: 'bg-red-50',
                            title: 'text-red-500',
                            description: 'text-red-500',
                            actionButton: 'bg-zinc-400',
                            cancelButton: 'bg-gray-100',
                            closeButton: 'bg-white',
                            icon: 'text-red-400',
                        },
                        description: data.msg || '',
                        duration: 2000,
                        position: 'top-right',
                        dismissible: true,
                        closeButton: true,
                        // icon: <MyIcon />,
                    });
                }
            }
        },
        onExecute: (data) => {
            if (editMode) toast.loading('EL producto se esta editando 🧐')
            if (!editMode) toast.loading('EL producto se esta creando 🐱‍🏍')

        },
    });

    const onSubmit = (data: ProductSchemaType) => {
        // console.log(data);
        execute(data);
    }

    if (chargetProduct) {
        return (
            <p>Cargando...</p>
        )
    }

    return (
        <Card className="overflow-x-hidden bg-white/5 backdrop-blur-xl" >
            <CardHeader>
                <CardTitle>{editMode ? "Edit Product" : "Create Product"}</CardTitle>
                <CardDescription>
                    {editMode
                        ? "Make changes to existing product"
                        : "Add a brand new product"}
                </CardDescription>
            </CardHeader>
            <CardContent className="sm:mx-auto sm:w-full sm:min-w-[480px] sm:max-w-[500px]">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Product Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Saekdong Stripe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Tiptap value={field.value} setValue={form.setValue} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Product Price</FormLabel>
                                    <FormControl>
                                        <div className="flex items-center gap-2">
                                            <DollarSign
                                                size={36}
                                                className="p-2 bg-muted  rounded-md"
                                            />
                                            <Input
                                                {...field}
                                                type="number"
                                                placeholder="Your price in USD"
                                                step="0.1"
                                                min={0}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            className="w-full bg-amber-500 text-black"
                            disabled={
                                status === "executing" ||
                                !form.formState.isValid ||
                                !form.formState.isDirty
                            }
                            type="submit"
                        >
                            {editMode ? "Save Changes" : "Create Product"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>

    );
};

export default ProductForm;
