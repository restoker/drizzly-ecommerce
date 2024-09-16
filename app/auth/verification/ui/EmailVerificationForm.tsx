"use client";

import { confirmToken } from "@/server/actions/tokens";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const EmailVerificationForm = () => {
    const token = useSearchParams().get('token');
    const router = useRouter();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const handleVerification = useCallback(async () => {
        if (success || error) return;

        if (!token) {
            setError('Token not found');
            return;
        }

        const resp = await confirmToken(token);

        if (!resp.ok) {
            setError(resp.msg);
        }

        if (resp.ok) {
            setSuccess(resp.msg);
            router.push('/auth/login')
        }

    }, []);

    useEffect(() => {
        handleVerification();
    }, []);


    return (
        <>
            <div aria-hidden="true" className="relative rounded-lg">
                <img
                    alt=""
                    src="https://images.pexels.com/photos/262438/pexels-photo-262438.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    className="h-96 w-full object-cover object-center rounded-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950" />
            </div>

            <div className="relative mx-auto -mt-12 max-w-7xl px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">
                <div className="mx-auto max-w-2xl text-center lg:max-w-4xl">
                    <h2 className="text-3xl font-bold tracking-tight text-green-500 sm:text-4xl">Cuenta activada</h2>
                    {error && <p className="mt-4 text-gray-200">{error}
                    </p>}
                    {success && <p className="mt-4 text-gray-200">{success}
                    </p>}
                </div>

                {/* <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-y-16 lg:max-w-none lg:grid-cols-3 lg:gap-x-8">
                        {features.map((feature) => (
                            <div key={feature.name} className="border-t border-gray-200 pt-4">
                                <dt className="font-medium text-gray-900">{feature.name}</dt>
                                <dd className="mt-2 text-sm text-gray-500">{feature.description}</dd>
                            </div>
                        ))}
                    </dl> */}
            </div>
        </>
    );
};

export default EmailVerificationForm;
