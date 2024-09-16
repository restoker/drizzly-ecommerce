"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/types/register-schema";
import { useAction } from "next-safe-action/hooks";
import { registerUserWithEmail } from "@/server/actions/register-user";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import clsx from "clsx";

interface IFormInput {
    name: string;
    email: string;
    password: string;
}

const FormRegister = () => {
    const [reveal, setReveal] = useState(true);

    const { execute, result, status } = useAction(registerUserWithEmail, {
        onSuccess: ({ data }) => {
            // console.log(data);
            if (data?.ok) {
                toast(result.data?.msg || '', {
                    className: 'my-classname',
                    description: 'Su operación fue exitosa 😁',
                    duration: 2000,
                    // icon: <MyIcon />,
                });
                redirect('/auth/login');
            }

            if (!data?.ok) {
                toast('Algo salio mal 😁', {
                    className: 'text-red-500',
                    description: data?.msg,
                    duration: 2000,
                    // icon: <MyIcon />,
                });
            }
        },
        onError: ({ error }) => {
            console.log(error);
        }
    })

    const handleReveal = () => {
        setReveal(state => !state);
    }

    const { register, handleSubmit, watch, formState: { errors } } = useForm<IFormInput>({
        mode: 'all',
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: '',
            password: '',
            name: '',
        }
    });

    const onSubmit = async (data: IFormInput) => {
        // console.log(status);
        execute(data);
        // if (result) {
        //     if (result.data?.ok) {
        //         toast(result.data?.msg || '', {
        //             className: 'my-classname',
        //             description: 'Su operación fue exitosa 😁',
        //             duration: 2000,
        //             // icon: <MyIcon />,
        //         });
        //         redirect('/auth/login');
        //     }
        //     if (!result.data?.ok) {
        //         toast(result.data?.msg || '', {
        //             className: 'my-classname',
        //             description: 'Algo salio mal 😁',
        //             duration: 2000,
        //             // icon: <MyIcon />,
        //         });
        //     }
        // }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
                <label htmlFor="name" className="block text-sm font-bold leading-6">
                    Name
                </label>
                <div className="mt-2">
                    <input
                        {...register('name', {
                            minLength: { value: 3, message: 'name is too short' },
                            maxLength: { value: 150, message: 'name is too big' }
                        })}
                        id="name"
                        name="name"
                        type="text"
                        required
                        autoComplete="name"
                        className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6 bg-transparent"
                    />
                    {errors.name && <p className="text-red-500 mt-2 text-sm">{errors.name?.message}😥</p>}
                </div>
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-bold leading-6">
                    Email address
                </label>
                <div className="mt-2">
                    <input
                        {...register('email', {
                            required: { value: true, message: 'El campo es obligatorio' },
                            pattern: {
                                value: /^\S+@\S+\.\S+$/,
                                message: "Entered value does not match email format"
                            }
                        })}
                        id="email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6 bg-transparent"
                    />
                    {errors.email && <p className="text-red-500 mt-2 text-sm">{errors.email?.message}😥</p>}
                </div>
            </div>

            <div>
                <label htmlFor="password" className="block text-sm font-bold leading-6">
                    Password
                </label>
                <div className="mt-2 relative">
                    <input
                        {...register('password', {
                            required: "required",
                            minLength: {
                                value: 5,
                                message: "min length is 5"
                            }
                        })}
                        id="password"
                        name="password"
                        type={reveal ? "password" : "text"}
                        required
                        autoComplete="current-password"
                        className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6 bg-transparent"
                    />
                    {errors.password && <p className="text-red-500 mt-2 text-sm">{errors.password?.message}😥</p>}
                    {reveal
                        ?
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6 absolute text-amber-500 top-[6px] right-2 cursor-pointer"
                            onClick={handleReveal}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                        :
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6 absolute text-amber-500 top-[6px] right-2 cursor-pointer"
                            onClick={handleReveal}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                    }
                </div>
            </div>

            <div className="flex items-center justify-between">
                {/* <div className="flex items-center">
            <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-600"
            />
            <label htmlFor="remember-me" className="ml-3 block text-sm leading-6 text-gray-900">
                Remember me
            </label>
        </div> */}

                <div className="text-sm leading-6">
                    <Link href="/auth/forgot" className="font-semibold text-amber-600 hover:text-amber-500">
                        Forgot password?
                    </Link>
                </div>
            </div>

            <div>
                <button
                    disabled={status === 'executing' ? true : false}
                    type="submit"
                    className={clsx(status === 'executing' ? "cursor-progress" : "cursor-pointer", "flex w-full justify-center rounded-md bg-amber-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600")}
                >
                    Register
                </button>
            </div>
        </form>
    );
};

export default FormRegister;
