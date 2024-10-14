import { db } from "@/server";
import placeholder from "@/public/img/placeholder_small.jpg";
import { DataTable } from "./DataTable";
import { columns } from "./columns";


export default async function ProductsPage() {
    const products = await db.query.products.findMany({
        with: {
            productVariant: { with: { variantImages: true, variantTags: true } },
        },
        orderBy: (products, { desc }) => [desc(products.created)]
    });

    if (!products) throw new Error('Error on server');

    const dataTable = products.map((product) => {
        // console.log(product.productVariant);
        // console.log(product);
        const time = new Date(product.created!);
        const realTime = time.toLocaleString('pe-PE', { timeZone: 'UTC', month: '2-digit', year: '2-digit', day: '2-digit' });
        // console.log(product.productVariant[0].variantImages);
        if (product.productVariant.length === 0) {
            return {
                id: product.id,
                // id: product.id.split('-')[0],
                title: product.title,
                price: product.price,
                variants: [],
                image: placeholder.src,

                // created: realTime,
            }
        }
        const image = product.productVariant[0].variantImages[0].url;
        return {
            id: product.id,
            title: product.title,
            price: product.price,
            variants: product.productVariant,
            image,
        };
    });

    if (!dataTable) throw new Error("No data found")
    return (
        <div>
            <DataTable columns={columns} data={dataTable} />
        </div>
    );
}