import Link from "next/link";
import FormRegister from "./ui/FormRegister";
import SocialRegister from "../login/ui/SocialRegister";

export default function RegisterPage() {
    return (
        <>
            <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <Link href={'/'}>
                        <img
                            alt="Your Company"
                            src='../img/logo.jpg'
                            className="mx-auto h-16 w-auto rounded-tr-lg rounded-bl-lg border-4 border-amber-600 delay-700 duration-500 transition-all"
                        />
                    </Link>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
                    <div className="px-6 py-12 shadow-lg sm:rounded-lg sm:px-12 border border-gray-50/50">

                        <FormRegister />

                        <div>
                            <div className="relative mt-10">
                                <div aria-hidden="true" className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200/40" />
                                </div>
                                <div className="relative flex justify-center text-sm font-medium leading-6">
                                    <span className="bg-white/90 px-6 text-gray-900 rounded-lg">Or continue with</span>
                                </div>
                            </div>

                            <SocialRegister />
                        </div>
                    </div>

                    <p className="mt-2 text-center text-sm font-medium">
                        You Have Account?{' '}
                        <Link href="/auth/login" className="font-semibold leading-6 text-amber-600 hover:text-amber-500">
                            Log Into
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}