import { ArrowLeftCircleIcon, BackspaceIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import ForgotForm from "./ui/ForgotForm";

export default function ForgotPasswordPage() {
    return (
        <>
            <div className="flex h-svh flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
                <div className="w-full max-w-sm space-y-10">
                    <div>
                        <Link href={'/'}>
                            <img
                                alt="Your Company"
                                src={'../img/logo.jpg'}
                                className="mx-auto h-16 w-auto rounded-tr-lg rounded-bl-lg border-4 border-amber-600 delay-700 duration-500 transition-all"
                            />
                        </Link>
                        <h2 className="mt-10 text-center text-sm font-bold leading-snug tracking-tight text-gray-200">
                            Enter the email address associated with your account and we'll send you link to reset your password.
                        </h2>
                    </div>

                    <ForgotForm />

                    <p className="text-center text-sm leading-6 text-gray-500 flex flex-row-reverse justify-center items-center py-2 rounded-lg">
                        {/* Not a member?{' '} */}
                        <Link href="/auth/login" className="font-semibold text-amber-600 hover:text-amber-500 flex justify-between flex-row-reverse group">
                            Back to login
                            <ArrowLeftCircleIcon className="h-6 w-6 text-amber-600 mr-3 group-hover:text-amber-500" />
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}