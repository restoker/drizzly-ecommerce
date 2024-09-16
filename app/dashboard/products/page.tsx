import { db } from "@/server";
import placeholder from "@/public/img/placeholder_small.jpg";
import { DataTable } from "./DataTable";
import { columns } from "./columns";


export default async function ProductsPage() {
    const products = await db.query.products.findMany({
        orderBy: (products, { desc }) => [desc(products.created)]
    });

    const dataTable = products.map((product) => {
        const time = new Date(product.created!);
        const realTime = time.toLocaleString('pe-PE', { timeZone: 'UTC', month: '2-digit', year: '2-digit', day: '2-digit' });
        return {
            id: product.id,
            // id: product.id.split('-')[0],
            title: product.title,
            price: product.price,
            variants: [],
            image: placeholder.src,
            created: realTime,
        }
    });

    if (!products) throw new Error('Error on server');

    return (
        <div>
            <DataTable columns={columns} data={dataTable} />
        </div>
    );
}