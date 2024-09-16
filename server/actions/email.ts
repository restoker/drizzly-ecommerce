'use server'

import EmailTemplate from "@/components/EmailTemplate";
import { getBaseUrl } from "@/lib/base-url"
import { Resend } from 'resend'

// RESEND_API

const resend = new Resend(process.env.RESEND_API);

const domain = getBaseUrl();

export const sendVerificationEmail = async (email: string, token: string, name: string) => {
    const confirmLink = `${domain}/auth/verification?token=${token}`;

    try {
        const { data, error } = await resend.emails.send({
            from: 'EifuCommerce@resend.dev',
            to: email,
            subject: 'Sproud and Scribble - Confirm Email',
            react: EmailTemplate({ name, confirmLink }),
            // html: `<p>click to <a href='${confirmLink}'>Confirm Your Email</a></p>`
        });
        if (error) return { ok: false, msg: 'Error enviando el email' };
        if (data) return { ok: true, data, msg: 'El email fue enviado' };
    } catch (error) {
        return { ok: false, msg: 'Error enviando el email' }
    }

}

export const sendEmailResetPassword = async (email: string, token: string) => {
    const confirmLink = `${domain}/auth/newpassword?token=${token}`;

    try {
        const { data, error } = await resend.emails.send({
            from: 'EifuCommerce@resend.dev',
            to: email,
            subject: 'Sproud and Scribble - Confirm Email',
            // react: EmailTemplate({ name, confirmLink }),
            html: `<p>click here <a href='${confirmLink}'>Reset Your Password</a></p>`
        });
        if (error) return { ok: false, msg: 'Error enviando el email' };
        if (data) return { ok: true, data, msg: 'El email fue enviado' };
    } catch (error) {
        return { ok: false, msg: 'Error enviando el email' }
    }
}

export const sendTwoFactorTokenByEmail = async (
    email: string,
    token: string
) => {
    const { data, error } = await resend.emails.send({
        from: "EifuCommerce@resend.dev",
        to: email,
        subject: "Eifucommerce - Your 2 Factor Token",
        html: `<p>Your Confirmation Code: ${token}</p>`,
    })
    if (error) return console.log(error)
    if (data) return data
}