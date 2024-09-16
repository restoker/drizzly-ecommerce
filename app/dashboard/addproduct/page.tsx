import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import ProductForm from "./ui/ProductForm";

export default async function AddProductPage() {
    const session = await auth();

    if (session?.user.role !== 'admin') redirect('/dashboard/settings');

    return (
        <div className="py-16 min-h-svh">
            <ProductForm />
        </div>
    );
}