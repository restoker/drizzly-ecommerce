'use client';
import { productSchema, ProductSchemaType } from "@/types/product-schema";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { UserCircleIcon } from "lucide-react";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import Tiptap from "./Tiptap";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { createProductAction } from "@/server/actions/create-product";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { getProductAction } from "@/server/actions/get-product";

const ProductForm = () => {

    const router = useRouter();
    const params = useSearchParams();
    const editMode = params.get('id');

    useEffect(() => {
        if (editMode) {
            checkProduct(editMode);
        }
    }, []);

    const { register, handleSubmit, formState: { errors, isValid, isDirty }, control, setValue, setError, getValues } = useForm<ProductSchemaType>({
        mode: 'onChange',
        resolver: zodResolver(productSchema),
        defaultValues: {
            title: '',
            description: '',
            price: 0,
        }
    });

    const checkProduct = async (id: string) => {
        if (editMode) {
            const { ok, data: product, msg } = await getProductAction(id);
            if (!ok) {
                toast.error(`${msg}`);
                router.push('/dashboard/products');
                return;
            }
            if (product) {
                setValue('title', product.title);
                setValue('description', product.description);
                setValue('price', product.price);
                setValue('id', editMode);
            }
        }
    }

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

            editMode ? toast.loading('EL producto se esta editando 🧐') : toast.loading('EL producto se esta creando 🐱‍🏍')

        },
    });

    const onSubmit = (data: ProductSchemaType) => {
        // console.log(data);
        execute(data);
    }

    return (
        // <form onSubmit={handleSubmit(onSubmit)}>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-12">
                <div className="border-b border-gray-900/10 dark:border-gray-900/10 pb-12">
                    <h2 className="text-base font-semibold leading-7">{editMode ? 'Edit Product' : 'New Product'}</h2>
                    <p className="mt-1 text-sm leading-6 text-foreground/50">
                        This information will be displayed publicly so be careful what you share.
                    </p>

                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-7">

                        <div className="sm:col-span-4">
                            <label htmlFor="title" className="block text-sm leading-6 font-semibold">
                                Title
                            </label>
                            <div className="mt-2">
                                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-amber-600 sm:max-w-md">
                                    <Controller
                                        control={control}
                                        name="title"
                                        render={({ field }) => (
                                            <input
                                                value={field.value}
                                                disabled={status === 'executing'}
                                                // onChange={(value)=>setValue(value.)}
                                                // {...register('title')}
                                                onChange={({ target }) => setValue('title', target.value)}
                                                type="text"
                                                name="title"
                                                id="title"
                                                autoComplete="username"
                                                className="block flex-1 border-0 bg-transparent py-1.5 pl-2 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                                placeholder="janesmith"
                                            />
                                        )}
                                    />
                                </div>
                                {errors && <p className='text-sm text-red-500'>{errors.title?.message}</p>}
                            </div>
                        </div>

                        <div className="col-span-full">
                            <label htmlFor="description" className="block text-sm font-medium leading-6">
                                Description
                            </label>
                            <div className="mt-2">
                                <Controller
                                    // defaultValue={''}
                                    disabled={status === 'executing'}
                                    name='description'
                                    rules={{ required: true, minLength: { value: 40, message: 'Add more especifications' } }}
                                    control={control}
                                    render={({ field }) => (
                                        <>
                                            <Tiptap
                                                // {...field}
                                                setValue={setValue}
                                                value={field.value}
                                            />

                                        </>
                                    )
                                    }
                                />
                            </div>
                            {errors && <p className='text-sm text-red-500'>{errors.description?.message}</p>}
                            {/* <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">Write a few sentences about yourself.</p> */}
                        </div>

                        <div className="sm:col-span-4">
                            <label htmlFor="price" className="block text-sm leading-6 font-semibold">
                                Price
                            </label>
                            <div className="mt-2">
                                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-amber-600 sm:max-w-md">

                                    <input
                                        {...register('price')}
                                        disabled={status === 'executing'}
                                        type="number"
                                        name="price"
                                        id="price"
                                        step={"0.1"}
                                        min={0}
                                        className="block flex-1 border-0 bg-transparent py-1.5 pl-2 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                        placeholder="Your price in USD"
                                    />
                                </div>
                                {errors && <p className='text-sm text-red-500'>{errors.price?.message}</p>}
                            </div>
                        </div>


                        {/* <div className="col-span-full">
                            <label htmlFor="photo" className="block text-sm font-medium leading-6 text-gray-900">
                                Photo
                            </label>
                            <div className="mt-2 flex items-center gap-x-3">
                                <UserCircleIcon className="h-12 w-12 text-gray-300" aria-hidden="true" />
                                <button
                                    type="button"
                                    className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                >
                                    Change
                                </button>
                            </div>
                        </div> */}
                        {/* 
                        <div className="col-span-full">
                            <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">
                                Cover photo
                            </label>
                            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                                <div className="text-center">
                                    <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                        <label
                                            htmlFor="file-upload"
                                            className="relative cursor-pointer rounded-md bg-white font-semibold text-amber-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-amber-600 focus-within:ring-offset-2 hover:text-amber-500"
                                        >
                                            <span>Upload a file</span>
                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                                </div>
                            </div>
                        </div> */}
                    </div>
                </div>

                <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">Personal Information</h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">Use a permanent address where you can receive mail.</p>

                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-12">


                    </div>
                </div>

                {/* <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">Notifications</h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                        We'll always let you know about important changes, but you pick what else you want to hear about.
                    </p>

                    <div className="mt-10 space-y-10">
                        <fieldset>
                            <legend className="text-sm font-semibold leading-6 text-gray-900">By Email</legend>
                            <div className="mt-6 space-y-6">
                                <div className="relative flex gap-x-3">
                                    <div className="flex h-6 items-center">
                                        <input
                                            id="comments"
                                            name="comments"
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-600"
                                        />
                                    </div>
                                    <div className="text-sm leading-6">
                                        <label htmlFor="comments" className="font-medium text-gray-900">
                                            Comments
                                        </label>
                                        <p className="text-gray-500">Get notified when someones posts a comment on a posting.</p>
                                    </div>
                                </div>
                                <div className="relative flex gap-x-3">
                                    <div className="flex h-6 items-center">
                                        <input
                                            id="candidates"
                                            name="candidates"
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-600"
                                        />
                                    </div>
                                    <div className="text-sm leading-6">
                                        <label htmlFor="candidates" className="font-medium text-gray-900">
                                            Candidates
                                        </label>
                                        <p className="text-gray-500">Get notified when a candidate applies for a job.</p>
                                    </div>
                                </div>
                                <div className="relative flex gap-x-3">
                                    <div className="flex h-6 items-center">
                                        <input
                                            id="offers"
                                            name="offers"
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-600"
                                        />
                                    </div>
                                    <div className="text-sm leading-6">
                                        <label htmlFor="offers" className="font-medium text-gray-900">
                                            Offers
                                        </label>
                                        <p className="text-gray-500">Get notified when a candidate accepts or rejects an offer.</p>
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                        <fieldset>
                            <legend className="text-sm font-semibold leading-6 text-gray-900">Push Notifications</legend>
                            <p className="mt-1 text-sm leading-6 text-gray-600">These are delivered via SMS to your mobile phone.</p>
                            <div className="mt-6 space-y-6">
                                <div className="flex items-center gap-x-3">
                                    <input
                                        id="push-everything"
                                        name="push-notifications"
                                        type="radio"
                                        className="h-4 w-4 border-gray-300 text-amber-600 focus:ring-amber-600"
                                    />
                                    <label htmlFor="push-everything" className="block text-sm font-medium leading-6 text-gray-900">
                                        Everything
                                    </label>
                                </div>
                                <div className="flex items-center gap-x-3">
                                    <input
                                        id="push-email"
                                        name="push-notifications"
                                        type="radio"
                                        className="h-4 w-4 border-gray-300 text-amber-600 focus:ring-indigo-600"
                                    />
                                    <label htmlFor="push-email" className="block text-sm font-medium leading-6 text-gray-900">
                                        Same as email
                                    </label>
                                </div>
                                <div className="flex items-center gap-x-3">
                                    <input
                                        id="push-nothing"
                                        name="push-notifications"
                                        type="radio"
                                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                    />
                                    <label htmlFor="push-nothing" className="block text-sm font-medium leading-6 text-gray-900">
                                        No push notifications
                                    </label>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                </div> */}
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
                <button
                    type="button"
                    className="text-sm font-semibold leading-6 text-gray-900"
                    disabled={status === 'executing'}
                >
                    Cancel
                </button>
                <button
                    disabled={status === 'executing' || !isValid || !isDirty}
                    type="submit"
                    className="rounded-md bg-amber-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
                >
                    {editMode ? "Save  changes" : "Create Product"}
                </button>
            </div>
        </form>
    );
};

export default ProductForm;
