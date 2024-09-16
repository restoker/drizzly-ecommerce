import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import SettingsForm from "./ui/SettingsForm";

export default async function SettingsPage() {
    const session = await auth();
    if (!session?.user) redirect('/auth/login');
    // if(session) return (
    // )
    return (
        <>
            <div className="py-16 min-h-svh">
                <SettingsForm session={session} />
            </div>
        </>
    );
}