'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { forgotPasswordSchema } from '@/types/forgot-password-schema';
import { useAction } from "next-safe-action/hooks";
import { forgotPasswordAction } from "@/server/actions/forgot-password";

interface IFormInput {
    email: string;
}

const ForgotForm = () => {

    const { execute, reset, status } = useAction(forgotPasswordAction);

    const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: '',
        }
    });

    const onSubmit = async (data: IFormInput) => {
        execute(data);
    }

    return (
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="relative -space-y-px rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-0 z-10 rounded-md ring-1 ring-inset ring-gray-300" />
                <div>
                    <label htmlFor="email-address" className="sr-only">
                        Email address
                    </label>
                    <input
                        {...register('email', {
                            required: { value: true, message: 'El campo es obligatorio' },
                            pattern: {
                                value: /^\S+@\S+\.\S+$/,
                                message: "Entered value does not match email format"
                            }
                        })}
                        id="email-address"
                        name="email"
                        type="email"
                        required
                        placeholder="Email address"
                        autoComplete="email"
                        className="relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6"
                    />
                </div>
            </div>

            <div>
                <button
                    disabled={status === 'executing' ? true : false}
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-amber-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white hover:bg-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
                >
                    Send Email
                </button>
            </div>
        </form>
    );
};

export default ForgotForm;
