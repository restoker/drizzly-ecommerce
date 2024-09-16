import Link from "next/link";
import NewPasswordForm from "./ui/NewPasswordForm";

export default function NewPassordPage() {
    return (
        <>
            <div className="flex min-h-svh flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <Link href={'/'}>
                        <img
                            alt="Your Company"
                            src='/img/logo.jpg'
                            className="mx-auto h-16 w-auto rounded-tr-lg rounded-bl-lg border-4 border-amber-600 delay-700 duration-500 transition-all"
                        />
                    </Link>
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
                        Sign in to your account
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <NewPasswordForm />

                    <p className="mt-10 text-center text-sm text-gray-400">
                        You have a account?{' '}
                        <Link href="/auth/login" className="font-semibold leading-6 text-amber-400 hover:text-amber-300">
                            return to Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}