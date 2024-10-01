'use client'

import { UploadButton } from '@/app/api/uploadthing/upload';
import { settingsActions } from '@/server/actions/settings';
import { settingsSchema } from '@/types/settings-schema';
import { Switch } from '@headlessui/react';
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Session } from 'next-auth';
import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface Props {
    session: Session,
    children?: React.ReactNode | undefined | JSX.Element | JSX.Element[]
}

interface IFormInput {
    name?: string;
    image?: string;
    isTwoFactorEnabled?: boolean;
    email?: string;
    password?: string;
    newPassword?: string;
}

const SettingsForm = ({ session }: Props) => {

    const router = useRouter();
    const [avatarUploading, setAvatarUploading] = useState(false);

    // console.log(session);
    const { register, handleSubmit, formState: { errors }, control, setValue, setError, getValues } = useForm<IFormInput>({
        // mode: 'all',
        resolver: zodResolver(settingsSchema),
        defaultValues: {
            name: session.user?.name || undefined,
            email: session.user?.email || undefined,
            password: undefined,
            newPassword: undefined,
            image: session.user?.image || undefined,
            isTwoFactorEnabled: session.user.isTwoFactorEnabled || false,
        }
    });
    // const { field } = useController({ name: 'password', control });
    // const password = watch('password');
    // const newPassword = watch('newPassword');
    // console.log(password);
    const { execute, status, result } = useAction(settingsActions, {
        onSuccess: ({ data }) => {
            // console.log(data);<
            if (data) {
                if (data.ok) {
                    toast.success('Server response', {
                        duration: 2000,
                        description: `${data.msg}`,
                        position: 'top-right',
                    })
                } else {
                    toast.error('Error', {
                        duration: 2000,
                        description: `${data.msg}`,
                        position: 'top-right',
                    })
                }
            }
        },
        onError: (error) => {
            toast.error('Error en el servidor')
        }
    });
    // console.log(password);
    const onSubmit = (data: IFormInput) => {
        // console.log(data);
        // console.log(data);
        execute(data);
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-12">
                    <div className="border-b border-gray-900/10">
                        <h2 className="text-base font-semibold leading-7">Profile</h2>
                        <p className="mt-1 text-sm leading-6">
                            This information will be displayed publicly so be careful what you share.
                        </p>

                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-4">
                                <label htmlFor="name" className="block text-sm font-medium leading-6">
                                    Name
                                </label>
                                <div className="mt-2">
                                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-amber-600 sm:max-w-md">
                                        <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">/</span>
                                        <input
                                            disabled={status === 'executing' || avatarUploading}
                                            {...register('name', {
                                                minLength: { value: 3, message: 'name is too short' },
                                                maxLength: { value: 150, message: 'name is too big' }
                                            })}
                                            id="name"
                                            name="name"
                                            type="text"
                                            placeholder="janesmith"
                                            autoComplete="name"
                                            className="block flex-1 border-0 bg-transparent py-1.5 pl-1 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>
                            </div>


                            <div className="col-span-full">
                                <label htmlFor="photo" className="block text-sm font-medium leading-6">
                                    Photo
                                </label>
                                <div className="mt-2 flex items-center gap-x-3">
                                    {!getValues('image') ? <UserCircleIcon aria-hidden="true" className="h-12 w-12 text-gray-300" /> : <img src={getValues('image')} className='h-12 w-12 rounded-full' alt='user_image' />}
                                    {/* <button
                                        type="button"
                                        className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 dark:text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                    >
                                        Change
                                    </button> */}
                                    <UploadButton
                                        className="scale-75 ut-button:ring-primary  ut-label:bg-red-50  ut-button:bg-amber-500  hover:ut-button:bg-amber-600 ut:button:transition-all ut-button:duration-500  ut-label:hidden ut-allowed-content:hidden"
                                        disabled={avatarUploading}
                                        onUploadBegin={() => {
                                            setAvatarUploading(true);
                                        }}
                                        onUploadError={(error) => {
                                            setError('image', {
                                                type: 'validate',
                                                message: error.message,
                                            });
                                            setAvatarUploading(false);
                                            return;
                                        }}
                                        onClientUploadComplete={(res) => {
                                            setValue('image', res[0].url);
                                            setAvatarUploading(false);
                                            return;
                                        }}
                                        endpoint="avatarUploader"
                                        content={{
                                            button({ ready }) {
                                                if (ready) return <div>Change Avatar</div>
                                                return <div>Uploading...</div>
                                            },
                                        }}
                                    />
                                </div>
                            </div>

                            {/* <div className="col-span-full hidden">
                                <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100">
                                    Cover photo
                                </label>
                                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 dark:border-gray-300">
                                    <div className="text-center">
                                        <PhotoIcon aria-hidden="true" className="mx-auto h-12 w-12 text-gray-300" />
                                        <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                            <label
                                                htmlFor="file-upload"
                                                className="relative cursor-pointer rounded-md bg-transparent font-semibold text-amber-600 focus-within:outline-none hover:text-amber-500"
                                            >
                                                <span>Upload a file</span>
                                                <input
                                                    disabled={status === 'executing' ? true : false}
                                                    id="file-upload"
                                                    name="file-upload"
                                                    type="file"
                                                    className="sr-only"
                                                />
                                            </label>
                                            <p className="pl-1 dark:text-gray-400">or drag and drop</p>
                                        </div>
                                        <p className="text-xs leading-5 text-gray-600 dark:text-gray-400">PNG, JPG, GIF up to 10MB</p>
                                    </div>
                                </div>
                            </div> */}

                        </div>
                    </div>

                    <>
                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-4">
                                <label htmlFor="email" className="block text-sm font-medium leading-6">
                                    Email address
                                </label>
                                <div className="mt-2">
                                    <input
                                        {...register('email', {
                                            pattern: {
                                                value: /^\S+@\S+\.\S+$/,
                                                message: "Entered value does not match email format"
                                            }
                                        })}
                                        disabled={true}
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6 bg-transparent"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="password" className="block text-sm font-medium leading-6">
                                    Password
                                </label>
                                <div className="mt-2">
                                    <Controller
                                        // defaultValue={''}
                                        name='password'
                                        rules={{ required: false }}
                                        control={control}
                                        render={({ field }) => (<>
                                            <input
                                                {...field}
                                                disabled={status === 'executing' || avatarUploading || session.user.isOauth}
                                                id="password"
                                                // value={value}
                                                // onChange={onChange}
                                                // name="password"
                                                type="password"
                                                autoComplete="current-password"
                                                className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6 bg-transparent"
                                            />
                                            {errors && <p className='text-sm text-red-500'>{errors.password?.message}</p>}
                                        </>)
                                        }
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="newPassword" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100">
                                    New Password
                                </label>
                                <div className="mt-2">
                                    <Controller
                                        // defaultValue={''}
                                        name='newPassword'
                                        disabled={session.user.isOauth === true || status === 'executing' || avatarUploading}
                                        control={control}
                                        render={({ field }) => (<>
                                            <input
                                                {...field}
                                                id="newPassword"
                                                // value={value}
                                                // onChange={onChange}
                                                // name="newPassword"
                                                type="password"
                                                autoComplete="new-password"
                                                className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6 bg-transparent"
                                            />
                                            {errors && <p className='text-sm text-red-500'>{errors.newPassword?.message}</p>}
                                        </>)
                                        }
                                    />
                                </div>
                            </div>
                            {/*                             
                            <div className="sm:col-span-3">
                                <label htmlFor="country" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100">
                                    Country
                                </label>
                                <div className="mt-2">
                                    <select
                                        id="country"
                                        name="country"
                                        autoComplete="country-name"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                    >
                                        <option>United States</option>
                                        <option>Canada</option>
                                        <option>Mexico</option>
                                    </select>
                                </div>
                            </div> */}

                            {/* <div className="col-span-full">
                                <label htmlFor="street-address" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100">
                                    Street address
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="street-address"
                                        name="street-address"
                                        type="text"
                                        autoComplete="street-address"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div> */}

                        </div>
                    </>

                    {session.user.isOauth ? null : <div className="border-b border-gray-900/10 pb-12">
                        <h2 className="text-base font-semibold leading-7">Enabled Two Factor Auhtentication</h2>
                        <p className="mt-1 text-sm leading-6">
                            Press on Switch for will enable two factor autentication, late this, send you a email each login into your account.
                        </p>

                        <div className="mt-10 space-y-10">
                            <Controller
                                name='isTwoFactorEnabled'
                                control={control}
                                render={({ field: { onChange, value } }) => <Switch
                                    disabled={status === 'executing' || avatarUploading || session.user.isOauth ? true : false}
                                    checked={value}
                                    onChange={onChange}
                                    className="group relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2 data-[checked]:bg-amber-600"
                                >
                                    <span className="sr-only">Use setting</span>
                                    <span className="pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-5">
                                        <span
                                            aria-hidden="true"
                                            className="absolute inset-0 flex h-full w-full items-center justify-center transition-opacity duration-200 ease-in group-data-[checked]:opacity-0 group-data-[checked]:duration-100 group-data-[checked]:ease-out"
                                        >
                                            <svg fill="none" viewBox="0 0 12 12" className="h-3 w-3 text-gray-400">
                                                <path
                                                    d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
                                                    stroke="currentColor"
                                                    strokeWidth={2}
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </span>
                                        <span
                                            aria-hidden="true"
                                            className="absolute inset-0 flex h-full w-full items-center justify-center opacity-0 transition-opacity duration-100 ease-out group-data-[checked]:opacity-100 group-data-[checked]:duration-200 group-data-[checked]:ease-in"
                                        >
                                            <svg fill="currentColor" viewBox="0 0 12 12" className="h-3 w-3 text-amber-600">
                                                <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                                            </svg>
                                        </span>
                                    </span>
                                </Switch>}
                            />

                        </div>
                    </div>}
                </div>

                <div className="mt-6 flex items-center justify-end gap-x-6">
                    <button
                        disabled={status === 'executing' || avatarUploading ? true : false}
                        type="button"
                        className="text-sm font-semibold leading-6 border-gray-200"
                        onClick={() => router.back()}
                    >
                        Cancel
                    </button>
                    <button
                        disabled={status === 'executing' ? true : false}
                        type="submit"
                        className="rounded-md bg-amber-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
                    >
                        Save
                    </button>
                </div>
            </form>
        </>
    )
}

export default SettingsForm;
