'use client';

import React from "react";
import { newPasswordSchema } from "@/types/new-password-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { newPasswordAction } from "@/server/actions/newPasword";
import { useSearchParams } from "next/navigation";

interface IFormInput {
    // email: string;
    password: string;
}

const NewPasswordForm = () => {
    const token = useSearchParams().get('token');
    const { execute, result, status } = useAction(newPasswordAction);

    const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>({
        resolver: zodResolver(newPasswordSchema),
        defaultValues: {
            password: '',
        }
    });

    const onSubmit = async ({ password }: IFormInput) => {
        if (!token) return;
        execute({ password, token });
    }


    if (!token) {
        return (
            <p className="text-center text-xl">No token ☹😲😖🙁😟</p>
        )
    }

    return (
        <>
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>

                <div>
                    <div className="flex items-center justify-between">
                        <label htmlFor="password" className="block text-sm font-medium leading-6 text-white">
                            New Password
                        </label>
                        {/* <div className="text-sm">
                            <a href="#" className="font-semibold text-amber-400 hover:text-amber-300">
                                Forgot password?
                            </a>
                        </div> */}
                    </div>
                    <div className="mt-2">
                        <input
                            {...register('password', {
                                required: { value: true, message: 'el campo es obligatorio' },
                                minLength: { value: 5, message: "Debe ingresar 5 caracteres como mínimo" }
                            })}
                            id="password"
                            name="password"
                            type="password"
                            placeholder="New password here"
                            required
                            autoComplete="current-password"
                            className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-amber-500 sm:text-sm sm:leading-6 placeholder:text-gray-200/50"
                        />
                    </div>
                </div>

                <div>
                    <button
                        disabled={status === 'executing' ? true : false}
                        type="submit"
                        className="flex w-full justify-center rounded-md bg-amber-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-amber-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
                    >
                        Submit Password
                    </button>
                </div>
            </form>
        </>
    );
};

export default NewPasswordForm;
