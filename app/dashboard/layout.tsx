import DashboardNav from "@/components/dashboardnav";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";


export default async function DashBoardLayout({ children }: { children: React.ReactNode }) {

    const session = await auth();

    if (!session?.user) {
        redirect('/auth/login')
    }
    // console.log(session?.user);

    return (
        <>
            <DashboardNav session={session} />
            {/* <h1>Hello Root Layout DashBoard</h1> */}
            {children}
        </>
    );
}