"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from "@/types/login-schema";
import { useAction } from 'next-safe-action/hooks'
import { loginWithEmailAndPassword } from "@/server/actions/email-signin";
import clsx from "clsx";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import { z } from "zod";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/InputOtp";

interface IFormInput {
    email: string;
    password: string;
}

const LoginForm = () => {
    const [reveal, setReveal] = useState(true);
    const [errormsg, setErrormsg] = useState<boolean | undefined>(false);
    const [success, setSuccess] = useState(false);
    const [twoFactor, setTwoFactor] = useState(false);
    // useEffect(() => {
    //     if (!success) return;
    //     window.location.replace('/');
    //     return () => setSuccess(false);
    // }, [success]);
    const { execute, result, status } = useAction(loginWithEmailAndPassword, {
        onSuccess: async ({ data }) => {
            if (data) {
                if (data.ok) {
                    if (data.twoFactor) {
                        setTwoFactor(true);
                    } else {
                        toast.success('Wellcome', {
                            classNames: {
                                toast: 'bg-green-50',
                                title: 'text-green-500',
                                description: 'text-green-500',
                                actionButton: 'bg-zinc-400',
                                cancelButton: 'bg-gray-100',
                                closeButton: 'bg-white',
                                icon: 'text-black',
                            },
                            description: data.msg,
                            duration: 2000,
                            position: 'top-right',
                            dismissible: true,
                            closeButton: true,
                            // icon: <MyIcon />,
                        });
                    }
                }
            }
        },
        onError: ({ error }) => {

        }
    });

    useEffect(() => {
        if (status === 'idle') return;
        if (result.data?.ok) {
            if (result.data.twoFactor) {
                toast.info('Message of System', {
                    classNames: {
                        toast: 'bg-cyan-50',
                        title: 'text-cyan-500',
                        description: 'text-cyan-500',
                        actionButton: 'bg-zinc-400',
                        cancelButton: 'bg-gray-100',
                        closeButton: 'bg-white',
                        icon: 'text-black',
                    },
                    description: result.data.msg,
                    duration: 2000,
                    position: 'top-right',
                    dismissible: true,
                    closeButton: true,
                    // icon: <MyIcon />,
                });
            } else {
                redirect('/');
            }
        } else {
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
                description: result.data?.msg! || '',
                duration: 2000,
                position: 'top-right',
                dismissible: true,
                closeButton: true,
                // icon: <MyIcon />,
            });
        }

    }, [result]);

    const { register, handleSubmit, formState: { errors }, control } = useForm<z.infer<typeof loginSchema>>({
        mode: 'all',
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        }
    });

    const onSubmit = async (data: IFormInput) => {
        // console.log(data);
        execute(data);
    }

    const handleReveal = () => {
        setReveal(state => !state);
    }

    return (
        <form action="#" className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {twoFactor
                ?
                <div className="w-full flex justify-center flex-col items-center">
                    <h1 className="text-xl text-center pb-6 font-bold">We've sent you a two factor code to your email</h1>
                    <p className="font-bold py-3 text-base">In your code here: </p>
                    <Controller
                        name="code"
                        defaultValue=""
                        control={control}
                        render={({ field }) => (
                            <InputOTP
                                {...field}
                                maxLength={6}
                                disabled={status === 'executing'}
                            >
                                <InputOTPGroup>
                                    <InputOTPSlot index={0} />
                                    <InputOTPSlot index={1} />
                                    <InputOTPSlot index={2} />
                                </InputOTPGroup>
                                <InputOTPSeparator />
                                <InputOTPGroup>
                                    <InputOTPSlot index={3} />
                                    <InputOTPSlot index={4} />
                                    <InputOTPSlot index={5} />
                                </InputOTPGroup>
                            </InputOTP>
                        )}
                    />
                </div>
                :
                <>
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
                        <label htmlFor="remember-me" className="ml-3 block text-sm leading-6 text-gray-200">
                            Remember me
                        </label>
                    </div> */}
                        <div className="text-sm leading-6">
                            <Link href="/auth/forgot" className="font-semibold text-amber-600 hover:text-amber-500">
                                Forgot password?
                            </Link>
                        </div>
                    </div>
                </>
            }

            <div>
                <button
                    disabled={status === 'executing' ? true : false}
                    type="submit"
                    className={clsx(status === 'executing' ? "cursor-progress" : "cursor-pointer", "flex w-full justify-center rounded-md bg-amber-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 mt-10")}
                >
                    Sign in
                </button>
            </div>
        </form>
    );
};

export default LoginForm;
